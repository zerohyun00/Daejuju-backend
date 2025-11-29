import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IUserRepository } from '../../ports/user.repository.interface';
import { IProfileRepository } from '../../ports/profile.repository.interface';
import { IUserStatRepository } from '../../ports/user-stat.repository.interface';
import { IEmailVerificationRepository } from '../../ports/email-verification.repository.interface';
import { IUniversityRepository } from '../../../../university/application/ports/university.repository.interface';
import { UNIVERSITY_REPOSITORY } from '../../../../university/university.di-tokens';
import {
  USER_REPOSITORY,
  PROFILE_REPOSITORY,
  USER_STAT_REPOSITORY,
  EMAIL_VERIFICATION_REPOSITORY,
} from '../../../user.di-tokens';
import { User } from '../../../domain/entities/user.entity';
import { Profile } from '../../../domain/entities/profile.entity';
import { UserStat } from '../../../domain/entities/user-stat.entity';
import { RegisterUserDto } from '../../dtos/register-user.dto';
import {
  InvalidArgumentException,
  ConflictException,
} from '../../../../../shared/domain/exceptions';
import { ERROR_MESSAGES } from '../../../domain/constants/error-messages';
import { SUCCESS_MESSAGES } from '../../../domain/constants/success-messages';
import { UNIVERSITY_ERROR_MESSAGES } from '../../../../university/domain/constants';

/**
 * 회원가입 Use Case
 * 이메일 인증 완료 후 실제 회원가입 처리
 */
@Injectable()
export class RegisterUserUseCase {
  private readonly logger = new Logger(RegisterUserUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepo: IProfileRepository,
    @Inject(USER_STAT_REPOSITORY)
    private readonly userStatRepo: IUserStatRepository,
    @Inject(EMAIL_VERIFICATION_REPOSITORY)
    private readonly verificationRepo: IEmailVerificationRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepo: IUniversityRepository,
    private readonly dataSource: DataSource,
  ) { }

  async execute(dto: RegisterUserDto): Promise<{
    userId: string;
    email: string;
    fullName: string;
    message: string;
  }> {
    const { email, password, fullName } = dto;

    // 1. 이메일 인증 여부 확인 (Redis)
    const verification = await this.verificationRepo.findByEmail(email);
    if (!verification || !verification.isVerified()) {
      throw new InvalidArgumentException(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    // 2. 이메일 중복 확인
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    // 3. 대학 정보 조회
    const domain = email.split('@')[1];
    const university = await this.universityRepo.findByDomain(domain);
    if (!university) {
      throw new InvalidArgumentException(
        `${UNIVERSITY_ERROR_MESSAGES.UNIVERSITY_DOMAIN_NOT_FOUND}: ${domain}`,
      );
    }

    const universityId = university.getId();
    if (!universityId) {
      throw new Error('대학 ID를 찾을 수 없습니다.');
    }

    // 4. User, Profile, UserStat 생성 및 저장 (트랜잭션)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // User 생성
      const user = await User.create(email, password, this.universityRepo);
      const savedUser = await this.userRepo.save(user);
      const userId = savedUser.getId();

      this.logger.log(`User 생성 완료: ${userId}, ${email}`);

      // Profile 생성
      const profile = Profile.create(userId, universityId);
      profile.update(fullName, null); // 이름 설정
      await this.profileRepo.save(profile);

      this.logger.log(`Profile 생성 완료: ${userId}`);

      // UserStat 생성
      const userStat = UserStat.create(userId);
      await this.userStatRepo.save(userStat);

      this.logger.log(`UserStat 생성 완료: ${userId}`);

      // 5. Redis 인증 데이터 삭제
      await this.verificationRepo.delete(email);

      this.logger.log(`Redis 인증 데이터 삭제 완료: ${email}`);

      await queryRunner.commitTransaction();

      this.logger.log(`✅ 회원가입 완료: ${email}`);

      return {
        userId,
        email,
        fullName,
        message: SUCCESS_MESSAGES.USER_REGISTERED,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`회원가입 실패: ${email}`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}


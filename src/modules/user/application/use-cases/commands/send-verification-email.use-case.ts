import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEmailVerificationRepository } from '../../ports/email-verification.repository.interface';
import { IEmailService } from '../../ports/email.service.interface';
import { IUniversityRepository } from '../../../../university/application/ports/university.repository.interface';
import { UNIVERSITY_REPOSITORY } from '../../../../university/university.di-tokens';
import {
  EMAIL_VERIFICATION_REPOSITORY,
  EMAIL_SERVICE,
} from '../../../user.di-tokens';
import { EmailVerification } from '../../../domain/entities/email-verification.entity';
import { InvalidArgumentException } from '../../../../../shared/domain/exceptions/invalid-argument.exception';
import { SendVerificationEmailDto } from '../../dtos/send-verification-email.dto';

@Injectable()
export class SendVerificationEmailUseCase {
  private readonly logger = new Logger(SendVerificationEmailUseCase.name);

  constructor(
    @Inject(EMAIL_VERIFICATION_REPOSITORY)
    private readonly verificationRepo: IEmailVerificationRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepo: IUniversityRepository,
  ) { }

  async execute(dto: SendVerificationEmailDto): Promise<{ message: string }> {
    const { email } = dto;

    // 1. 대학 도메인 검증
    const domain = email.split('@')[1];
    const university = await this.universityRepo.findByDomain(domain);

    if (!university) {
      throw new InvalidArgumentException(
        `등록되지 않은 대학 도메인입니다: ${domain}`,
      );
    }

    // 2. 기존 인증 데이터 확인 (재발송 제한)
    const existing = await this.verificationRepo.findByEmail(email);
    if (existing && !existing.isVerified()) {
      throw new InvalidArgumentException(
        '이미 인증 이메일이 발송되었습니다. 잠시 후 다시 시도해주세요.',
      );
    }

    // 3. 새로운 인증 생성
    const verification = EmailVerification.create(email);

    // 4. 이메일 발송
    try {
      await this.emailService.sendVerificationEmail(
        email,
        verification.getCode().getValue(),
      );
    } catch (error) {
      this.logger.error(`이메일 발송 실패: ${email}`, error);
      throw new Error('이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    // 5. Redis 저장 
    await this.verificationRepo.save(verification);

    this.logger.log(`인증 이메일 발송 완료: ${email}`);

    return {
      message:
        '인증 코드가 이메일로 발송되었습니다. 5분 내에 인증을 완료해주세요.',
    };
  }
}


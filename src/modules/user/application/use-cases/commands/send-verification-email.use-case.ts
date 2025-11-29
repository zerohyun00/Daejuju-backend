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
import { EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS } from '../../../domain/constants/email-verification.constants';

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

    // 2. 기존 인증 데이터 확인 (재발송 체크)
    const existing = await this.verificationRepo.findByEmail(email);
    if (existing && !existing.isVerified()) {
      if (!existing.canResend(EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS)) {
        const remainingSeconds = existing.getRemainingCooldown(
          EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS,
        );
        throw new InvalidArgumentException(
          `인증 이메일을 너무 자주 요청하고 있습니다. ${remainingSeconds}초 후에 다시 시도해주세요.`,
        );
      }
      // 쿨다운 시간이 지났으면 기존 데이터 삭제 후 새로 발송
      await this.verificationRepo.delete(email);
      this.logger.log(`기존 인증 데이터 삭제 (재발송): ${email}`);
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


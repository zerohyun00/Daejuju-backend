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
import { InvalidArgumentException } from '../../../../../shared/domain/exceptions';
import { SendVerificationEmailDto } from '../../dtos/send-verification-email.dto';
import { EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS } from '../../../domain/constants/email-verification.constants';
import { ERROR_MESSAGES } from '../../../domain/constants/error-messages';
import { SUCCESS_MESSAGES } from '../../../domain/constants/success-messages';
import { UNIVERSITY_ERROR_MESSAGES } from '../../../../university/domain/constants';

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
        `${UNIVERSITY_ERROR_MESSAGES.UNIVERSITY_DOMAIN_NOT_FOUND}: ${domain}`,
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
          `${ERROR_MESSAGES.EMAIL_RESEND_COOLDOWN} ${remainingSeconds}초 후에 다시 시도해주세요.`,
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
      throw new Error(ERROR_MESSAGES.EMAIL_SEND_FAILED);
    }

    // 5. Redis 저장 
    await this.verificationRepo.save(verification);

    this.logger.log(`인증 이메일 발송 완료: ${email}`);

    return {
      message: SUCCESS_MESSAGES.EMAIL_VERIFICATION_SENT,
    };
  }
}


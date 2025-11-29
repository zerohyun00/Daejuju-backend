import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEmailVerificationRepository } from '../../ports/email-verification.repository.interface';
import { EMAIL_VERIFICATION_REPOSITORY } from '../../../user.di-tokens';
import { VerifyEmailDto } from '../../dtos/verify-email.dto';
import { InvalidArgumentException } from '../../../../../shared/domain/exceptions';
import { ERROR_MESSAGES } from '../../../domain/constants/error-messages';
import { SUCCESS_MESSAGES } from '../../../domain/constants/success-messages';

@Injectable()
export class VerifyEmailUseCase {
  private readonly logger = new Logger(VerifyEmailUseCase.name);

  constructor(
    @Inject(EMAIL_VERIFICATION_REPOSITORY)
    private readonly verificationRepo: IEmailVerificationRepository,
  ) { }

  async execute(
    dto: VerifyEmailDto,
  ): Promise<{ message: string; verified: boolean }> {
    const { email, code } = dto;

    // 1. Redis에서 인증 데이터 조회
    const verification = await this.verificationRepo.findByEmail(email);

    if (!verification) {
      throw new InvalidArgumentException(
        ERROR_MESSAGES.EMAIL_VERIFICATION_NOT_FOUND,
      );
    }

    // 2. 인증 코드 검증 (Domain 로직)
    verification.verify(code);

    // 3. 인증 완료 상태 Redis에 저장
    await this.verificationRepo.save(verification);

    this.logger.log(`이메일 인증 완료: ${email}`);

    return {
      message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
      verified: true,
    };
  }
}


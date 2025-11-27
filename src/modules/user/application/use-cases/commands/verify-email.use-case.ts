import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEmailVerificationRepository } from '../../ports/email-verification.repository.interface';
import { EMAIL_VERIFICATION_REPOSITORY } from '../../../user.di-tokens';
import { VerifyEmailDto } from '../../dtos/verify-email.dto';
import { InvalidArgumentException } from '../../../../../shared/domain/exceptions/invalid-argument.exception';

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
        '인증 요청을 찾을 수 없습니다. 먼저 인증 이메일을 요청해주세요.',
      );
    }

    // 2. 인증 코드 검증 (Domain 로직)
    verification.verify(code);

    // 3. 인증 완료 상태 Redis에 저장
    await this.verificationRepo.save(verification);

    this.logger.log(`이메일 인증 완료: ${email}`);

    return {
      message: '이메일 인증이 완료되었습니다.',
      verified: true,
    };
  }
}


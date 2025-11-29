import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SendVerificationEmailDto } from '../../application/dtos/send-verification-email.dto';
import { VerifyEmailDto } from '../../application/dtos/verify-email.dto';
import { SendVerificationEmailUseCase } from '../../application/use-cases/commands/send-verification-email.use-case';
import { VerifyEmailUseCase } from '../../application/use-cases/commands/verify-email.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sendVerificationEmailUseCase: SendVerificationEmailUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) { }

  /**
   * 인증 이메일 발송
   * POST /auth/email/send-verification
   */
  @Post('email/send-verification')
  @HttpCode(HttpStatus.OK)
  async sendVerificationEmail(@Body() dto: SendVerificationEmailDto) {
    return this.sendVerificationEmailUseCase.execute(dto);
  }

  /**
   * 이메일 인증 코드 검증
   * POST /auth/email/verify
   */
  @Post('email/verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.verifyEmailUseCase.execute(dto);
  }
}


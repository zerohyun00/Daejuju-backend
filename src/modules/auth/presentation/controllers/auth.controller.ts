import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/commands/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/commands/refresh-token.use-case';
import { LogoutUseCase } from '../../application/use-cases/commands/logout.use-case';
import { LoginDto } from '../../application/dtos/login.dto';
import { RefreshTokenDto } from '../../application/dtos/refresh-token.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

/**
 * Auth Controller
 * 인증 관련 API 엔드포인트
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) { }

  /**
   * 로그인
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return await this.loginUseCase.execute(dto);
  }

  /**
   * 토큰 갱신
   * POST /auth/refresh
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return await this.refreshTokenUseCase.execute(dto);
  }

  /**
   * 로그아웃
   * POST /auth/logout
   * 
   * @CurrentUser 데코레이터로 인증된 사용자 정보 추출
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('email') email: string) {
    return await this.logoutUseCase.execute(email);
  }
}


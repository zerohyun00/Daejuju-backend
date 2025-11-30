import { Inject, Injectable, Logger } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../../user/user.di-tokens';
import { IUserRepository } from '../../../../user/application/ports/user.repository.interface';
import { JwtService } from '../../services/jwt.service';
import { LoginDto } from '../../dtos/login.dto';
import { LoginResponseDto } from '../../dtos/login-response.dto';
import { UserResponseDto } from '../../dtos/user-response.dto';
import { UnauthorizedException } from '../../../../../shared/domain/exceptions';
import { RedisCacheService } from '../../../../../common/cache/redis/redis-cache.service';
import {
  getAuthTokenCacheKey,
  AUTH_CACHE_TTL,
  AUTH_ERROR_MESSAGES
} from '../../../domain/constants';

/**
 * 로그인 Use Case
 * JWT Access Token 및 Refresh Token 발급
 * Redis에 Access Token 캐시 저장 (로그아웃 구현용)
 */
@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    // 1. 사용자 조회
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await user.validatePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // 3. JWT Payload 생성
    const payload = {
      sub: user.getId(),
      email: user.getEmail().getValue(),
      role: user.getRole(),
    };

    // 4. 토큰 생성
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    // 5. Redis에 Access Token 저장 (15분 TTL)
    // 로그아웃 시 이 토큰을 삭제하여 무효화
    const cacheKey = getAuthTokenCacheKey(user.getEmail().getValue());
    await this.redisCacheService.set(cacheKey, accessToken, AUTH_CACHE_TTL.ACCESS_TOKEN);

    this.logger.log(`로그인 성공: ${user.getEmail().getValue()}`);

    // 6. Response DTO 생성
    const userResponse = new UserResponseDto(
      user.getId(),
      user.getEmail().getValue(),
      user.getRole(),
    );

    return new LoginResponseDto(accessToken, refreshToken, userResponse);
  }
}


import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '../../services/jwt.service';
import { RefreshTokenDto } from '../../dtos/refresh-token.dto';
import { UnauthorizedException } from '../../../../../shared/domain/exceptions';
import { RedisCacheService } from '../../../../../common/cache/redis/redis-cache.service';
import {
  getAuthTokenCacheKey,
  AUTH_CACHE_TTL,
  AUTH_ERROR_MESSAGES
} from '../../../domain/constants';

@Injectable()
export class RefreshTokenUseCase {
  private readonly logger = new Logger(RefreshTokenUseCase.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async execute(dto: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // 1. Refresh Token 검증
    const payload = await this.jwtService.verifyRefreshToken(dto.refreshToken);

    if (!payload) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    }

    // 2. 새로운 토큰 생성
    const newPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    const accessToken = this.jwtService.generateAccessToken(newPayload);
    const refreshToken = this.jwtService.generateRefreshToken(newPayload);

    // 3. Redis에 새로운 Access Token 저장
    const cacheKey = getAuthTokenCacheKey(payload.email);
    await this.redisCacheService.set(cacheKey, accessToken, AUTH_CACHE_TTL.ACCESS_TOKEN);

    this.logger.log(`토큰 갱신 성공: ${payload.email}`);

    return {
      accessToken,
      refreshToken,
    };
  }
}


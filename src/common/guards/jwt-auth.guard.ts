import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../../modules/auth/application/services/jwt.service';
import { RedisCacheService } from '../cache/redis/redis-cache.service';
import { getAuthTokenCacheKey, AUTH_ERROR_MESSAGES } from '../../modules/auth/domain/constants';

/**
 * JWT Auth Guard
 * JWT 토큰 기반 인증 가드 + Redis 토큰 캐시 검증
 * 
 * 기능:
 * 1. JWT Access Token 검증
 * 2. Redis에 저장된 토큰과 비교 (로그아웃 체크)
 * 3. request.user에 사용자 정보 설정
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.TOKEN_NOT_PROVIDED);
    }

    try {
      // 1. JWT Access Token 검증
      const payload = await this.jwtService.verifyAccessToken(token);

      if (!payload) {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.TOKEN_INVALID);
      }

      // 2. Redis에서 토큰 확인 (로그아웃 체크)
      const cacheKey = getAuthTokenCacheKey(payload.email);
      const cachedToken = await this.redisCacheService.get<string>(cacheKey);

      if (cachedToken !== token) {
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.TOKEN_EXPIRED_OR_LOGGED_OUT);
      }

      // 3. request.user에 사용자 정보 설정
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.TOKEN_VERIFICATION_FAILED);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

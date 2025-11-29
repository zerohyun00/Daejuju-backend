import { Injectable, Logger } from '@nestjs/common';
import { RedisCacheService } from '../../../../../common/cache/redis/redis-cache.service';
import { getAuthTokenCacheKey } from '../../../domain/constants/cache-keys.constants';

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);

  constructor(private readonly redisCacheService: RedisCacheService) { }

  async execute(email: string): Promise<{ message: string }> {
    // Redis에서 토큰 삭제
    const cacheKey = getAuthTokenCacheKey(email);
    await this.redisCacheService.del(cacheKey);

    this.logger.log(`로그아웃 성공: ${email}`);

    return {
      message: '로그아웃되었습니다',
    };
  }
}


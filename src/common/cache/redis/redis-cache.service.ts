import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

export const REDIS_OPERATION_TIMEOUT = 5000; // 5초
export const DEFAULT_TTL = 300; // 5분 

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.logger.log('✅ Redis 클라이언트 주입 완료');
  }

  /**
   * Redis에서 값 조회
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.withTimeout(this.redis.get(key));
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(`Redis GET 실패: ${key}`, error);
      throw new ServiceUnavailableException('Redis 조회 중 오류가 발생했습니다');
    }
  }

  /**
   * Redis에 값 저장 (TTL 초 단위)
   */
  async set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      this.logger.debug(`Redis SET 시도: ${key} (TTL: ${ttl}초)`);

      const serialized = JSON.stringify(value);

      await this.withTimeout(this.redis.setex(key, ttl, serialized));

      this.logger.log(`Redis SET 완료: ${key} (TTL: ${ttl}초)`);
    } catch (error) {
      this.logger.error(`Redis SET 실패: ${key}`, error);
      throw new ServiceUnavailableException('Redis 저장 중 오류가 발생했습니다');
    }
  }

  /**
   * Redis에서 값 삭제
   */
  async del(key: string): Promise<void> {
    try {
      await this.withTimeout(this.redis.del(key));
      this.logger.log(`Redis DEL 완료: ${key}`);
    } catch (error) {
      this.logger.error(`Redis DEL 실패: ${key}`, error);
      throw new ServiceUnavailableException('Redis 삭제 중 오류가 발생했습니다');
    }
  }

  /**
   * 캐시가 없으면 함수 실행 후 저장 (getWithSet 패턴)
   */
  async getWithSet<T>(
    key: string,
    fnc: () => Promise<T>,
    ttl: number = DEFAULT_TTL,
  ): Promise<T> {
    try {
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      const result = await fnc();

      await this.set(key, result, ttl);

      return result;
    } catch (error) {
      this.logger.error(`Redis GET_WITH_SET 실패: ${key}`, error);
      throw new ServiceUnavailableException('Redis 처리 중 오류가 발생했습니다');
    }
  }

  /**
   * Prefix로 시작하는 모든 키 조회 (SCAN 패턴 - Non-blocking)
   */
  async findByPrefix<T = any>(prefix: string): Promise<Record<string, T>> {
    try {
      const results: Record<string, T> = {};

      const stream = this.redis.scanStream({
        match: `${prefix}*`,
        count: 100,
      });

      for await (const keys of stream) {
        for (const key of keys) {
          const value = await this.get<T>(key);
          if (value !== null) {
            results[key] = value;
          }
        }
      }

      return results;
    } catch (error) {
      this.logger.error(`Redis SCAN 실패: ${prefix}`, error);
      throw new ServiceUnavailableException('Redis 검색 중 오류가 발생했습니다');
    }
  }

  /**
   * 키의 남은 TTL 조회 (초 단위)
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Redis TTL 조회 실패: ${key}`, error);
      throw new ServiceUnavailableException('Redis TTL 조회 중 오류가 발생했습니다');
    }
  }

  /**
   * 패턴에 맞는 모든 키 조회 (SCAN 기반 - Non-blocking)
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      const keys: string[] = [];

      const stream = this.redis.scanStream({
        match: pattern,
        count: 100,
      });

      for await (const batch of stream) {
        keys.push(...batch);
      }

      return keys;
    } catch (error) {
      this.logger.error(`Redis SCAN 조회 실패: ${pattern}`, error);
      throw new ServiceUnavailableException('Redis SCAN 조회 중 오류가 발생했습니다');
    }
  }

  /**
   * Timeout 적용 (5초)
   */
  private async withTimeout<T>(operation: Promise<T>): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Redis 작업 시간 초과 (5초)'));
      }, REDIS_OPERATION_TIMEOUT);
    });

    return Promise.race([operation, timeoutPromise]);
  }
}


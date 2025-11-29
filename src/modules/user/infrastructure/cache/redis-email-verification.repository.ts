import { Injectable, Logger } from '@nestjs/common';
import { RedisCacheService } from '../../../../common/cache/redis/redis-cache.service';
import { IEmailVerificationRepository } from '../../application/ports/email-verification.repository.interface';
import { EmailVerification } from '../../domain/entities/email-verification.entity';
import {
  EMAIL_VERIFICATION_TTL_SECONDS,
  EMAIL_VERIFICATION_CACHE_PREFIX,
} from '../../domain/constants/email-verification.constants';

@Injectable()
export class RedisEmailVerificationRepository
  implements IEmailVerificationRepository {
  private readonly logger = new Logger(RedisEmailVerificationRepository.name);

  constructor(private readonly redisCache: RedisCacheService) { }

  private getKey(email: string): string {
    return `${EMAIL_VERIFICATION_CACHE_PREFIX}${email.toLowerCase().trim()}`;
  }

  async save(verification: EmailVerification): Promise<void> {
    const key = this.getKey(verification.getEmail());
    const data = verification.toCache();

    const ttlSeconds = EMAIL_VERIFICATION_TTL_SECONDS;

    await this.redisCache.set(key, data, ttlSeconds);

    this.logger.log(
      `이메일 인증 저장: ${verification.getEmail()} (TTL: ${ttlSeconds}초)`,
    );
  }

  async findByEmail(email: string): Promise<EmailVerification | null> {
    const key = this.getKey(email);
    const data =
      await this.redisCache.get<ReturnType<EmailVerification['toCache']>>(key);

    if (!data) {
      return null;
    }

    return EmailVerification.fromCache(data);
  }

  async delete(email: string): Promise<void> {
    const key = this.getKey(email);
    await this.redisCache.del(key);
    this.logger.log(`이메일 인증 삭제: ${email}`);
  }

  async isVerified(email: string): Promise<boolean> {
    const verification = await this.findByEmail(email);
    return verification ? verification.isVerified() : false;
  }
}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserSchema } from './infrastructure/persistence/schemas/user.schema';
import { ProfileSchema } from './infrastructure/persistence/schemas/profile.schema';
import { UserStatSchema } from './infrastructure/persistence/schemas/user-stat.schema';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { ProfileRepository } from './infrastructure/persistence/repositories/profile.repository';
import { UserStatRepository } from './infrastructure/persistence/repositories/user-stat.repository';
import { RedisEmailVerificationRepository } from './infrastructure/cache/redis-email-verification.repository';
import { NodemailerEmailService } from './infrastructure/services/nodemailer-email.service';
import {
  USER_REPOSITORY,
  PROFILE_REPOSITORY,
  USER_STAT_REPOSITORY,
  EMAIL_VERIFICATION_REPOSITORY,
  EMAIL_SERVICE,
} from './user.di-tokens';
import { UniversityModule } from '../university/university.module';
import { SendVerificationEmailUseCase } from './application/use-cases/commands/send-verification-email.use-case';
import { VerifyEmailUseCase } from './application/use-cases/commands/verify-email.use-case';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserSchema, ProfileSchema, UserStatSchema]),
    UniversityModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: PROFILE_REPOSITORY,
      useClass: ProfileRepository,
    },
    {
      provide: USER_STAT_REPOSITORY,
      useClass: UserStatRepository,
    },
    {
      provide: EMAIL_VERIFICATION_REPOSITORY,
      useClass: RedisEmailVerificationRepository,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: NodemailerEmailService,
    },
    SendVerificationEmailUseCase,
    VerifyEmailUseCase,
  ],
  exports: [
    USER_REPOSITORY,
    PROFILE_REPOSITORY,
    USER_STAT_REPOSITORY,
    EMAIL_VERIFICATION_REPOSITORY,
  ],
})
export class UserModule { }


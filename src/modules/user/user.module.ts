import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/persistence/schemas/user.schema';
import { ProfileSchema } from './infrastructure/persistence/schemas/profile.schema';
import { UserStatSchema } from './infrastructure/persistence/schemas/user-stat.schema';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { ProfileRepository } from './infrastructure/persistence/repositories/profile.repository';
import { UserStatRepository } from './infrastructure/persistence/repositories/user-stat.repository';
import {
  USER_REPOSITORY,
  PROFILE_REPOSITORY,
  USER_STAT_REPOSITORY,
} from './user.di-tokens';
import { UniversityModule } from '../university/university.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSchema,
      ProfileSchema,
      UserStatSchema,
    ]),
    UniversityModule,
  ],
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
  ],
  exports: [
    USER_REPOSITORY,
    PROFILE_REPOSITORY,
    USER_STAT_REPOSITORY,
  ],
})
export class UserModule { }


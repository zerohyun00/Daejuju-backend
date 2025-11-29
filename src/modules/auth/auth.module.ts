import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './application/services/jwt.service';
import { LoginUseCase } from './application/use-cases/commands/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/commands/refresh-token.use-case';
import { LogoutUseCase } from './application/use-cases/commands/logout.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { RedisCacheModule } from '../../common/cache/redis/redis-cache.module';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { jwtOptions } from './infrastructure/config/jwt.config';

@Module({
  imports: [
    NestJwtModule.registerAsync(jwtOptions),
    UserModule,
    RedisCacheModule,
  ],
  providers: [
    JwtService,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    JwtAuthGuard,
  ],
  controllers: [AuthController],
  exports: [JwtService, JwtAuthGuard],
})
export class AuthModule { }


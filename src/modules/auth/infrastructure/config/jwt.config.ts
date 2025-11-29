import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

/**
 * JWT 설정
 * Access Token 및 Refresh Token 서명 설정
 */
export const jwtOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<JwtModuleOptions> => {
    const secret = configService.getOrThrow<string>('JWT_SECRET');

    return {
      secret,
      signOptions: {
        issuer: 'daejuju',
        audience: 'daejuju-users',
      },
    };
  },
};


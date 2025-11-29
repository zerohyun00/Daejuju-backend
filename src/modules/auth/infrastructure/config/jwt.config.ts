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
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다');
    }

    return {
      secret,
      signOptions: {
        issuer: 'daejuju',
        audience: 'daejuju-users',
      },
    };
  },
};


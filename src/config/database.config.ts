import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CustomSnakeNamingStrategy } from '../common/utils/snake-case-naming.strategy';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';

  return {
    type: 'mariadb',
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [
      __dirname + '/../**/*.entity{.ts,.js}',
      __dirname + '/../**/*.schema{.ts,.js}',
    ],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: !isProduction, // 개발 환경에서만 자동 동기화
    logging: !isProduction, // 개발 환경에서만 로깅
    charset: 'utf8mb4',
    namingStrategy: new CustomSnakeNamingStrategy(),
  };
};


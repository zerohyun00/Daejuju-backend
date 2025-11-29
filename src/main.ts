import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UniversitySeeder } from './modules/university/infrastructure/seeders/university.seeder';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 개발 환경에서 자동 시드 실행
  if (process.env.NODE_ENV === 'development') {
    logger.log('시드 실행');
    const universitySeeder = app.get(UniversitySeeder);
    await universitySeeder.seed();
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversitySchema } from './infrastructure/persistence/schemas/university.schema';
import { UniversityRepository } from './infrastructure/persistence/repositories/university.repository';
import { UniversitySeeder } from './infrastructure/seeders/university.seeder';
import { UNIVERSITY_REPOSITORY } from './university.di-tokens';
import { GetUniversitiesUseCase } from './application/use-cases/queries/get-universities.use-case';
import { FindUniversityByDomainUseCase } from './application/use-cases/queries/find-university-by-domain.use-case';
import { UniversityController } from './presentation/controllers/university.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UniversitySchema]),
  ],
  controllers: [UniversityController],
  providers: [
    {
      provide: UNIVERSITY_REPOSITORY,
      useClass: UniversityRepository,
    },
    GetUniversitiesUseCase,
    FindUniversityByDomainUseCase,
    UniversitySeeder,
  ],
  exports: [
    UNIVERSITY_REPOSITORY,
    FindUniversityByDomainUseCase,
  ],
})
export class UniversityModule { }


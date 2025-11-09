import { Inject, Injectable } from '@nestjs/common';
import {
  IUniversityRepository,
  UNIVERSITY_REPOSITORY,
} from '../../ports/university.repository.interface';
import { University } from '../../../domain/entities/university.entity';

/**
 * Get Universities Use Case
 * 모든 대학 목록 조회
 */
@Injectable()
export class GetUniversitiesUseCase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: IUniversityRepository,
  ) { }

  async execute(): Promise<University[]> {
    return await this.universityRepository.findAll();
  }
}


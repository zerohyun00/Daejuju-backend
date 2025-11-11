import { Inject, Injectable } from '@nestjs/common';
import { IUniversityRepository } from '../../ports/university.repository.interface';
import { UNIVERSITY_REPOSITORY } from '../../../university.di-tokens';
import { University } from '../../../domain/entities/university.entity';
import { NotFoundException } from '../../../../../shared/domain/exceptions/not-found.exception';

/**
 * Find University By Domain Use Case
 * 도메인으로 대학 조회 (User 모듈에서 사용)
 */
@Injectable()
export class FindUniversityByDomainUseCase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: IUniversityRepository,
  ) { }

  async execute(domain: string): Promise<University> {
    const university = await this.universityRepository.findByDomain(domain);

    if (!university) {
      throw new NotFoundException('University', domain);
    }

    return university;
  }
}


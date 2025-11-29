import { Inject, Injectable } from '@nestjs/common';
import { IUniversityRepository } from '../../ports/university.repository.interface';
import { UNIVERSITY_REPOSITORY } from '../../../university.di-tokens';
import { University } from '../../../domain/entities/university.entity';
import { NotFoundException } from '../../../../../shared/domain/exceptions/not-found.exception';
import { UNIVERSITY_ERROR_MESSAGES } from '../../../domain/constants';

/**
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
      throw new NotFoundException(
        `${UNIVERSITY_ERROR_MESSAGES.UNIVERSITY_DOMAIN_NOT_FOUND}: ${domain}`,
      );
    }

    return university;
  }
}


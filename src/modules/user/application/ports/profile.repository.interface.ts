import { Profile } from '../../domain/entities/profile.entity';
import { IBaseRepository } from '../../../../shared/application/base.repository.interface';

export interface IProfileRepository extends IBaseRepository<Profile> {

  findByUserId(userId: string): Promise<Profile | null>;

  findByUniversityId(universityId: number): Promise<Profile[]>;

  findTopRankedByUniversity(
    universityId: number,
    limit: number,
  ): Promise<Profile[]>;
}


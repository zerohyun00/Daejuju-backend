import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProfileRepository } from '../../../application/ports/profile.repository.interface';
import { Profile } from '../../../domain/entities/profile.entity';
import { ProfileSchema } from '../schemas/profile.schema';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(
    @InjectRepository(ProfileSchema)
    private readonly profileRepository: Repository<ProfileSchema>,
  ) { }

  async findById(id: string): Promise<Profile | null> {
    const schema = await this.profileRepository.findOne({ where: { id } });
    return schema ? Profile.fromDB(schema) : null;
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const schema = await this.profileRepository.findOne({
      where: { user_id: userId },
    });
    return schema ? Profile.fromDB(schema) : null;
  }

  async findByUniversityId(universityId: number): Promise<Profile[]> {
    const schemas = await this.profileRepository.find({
      where: { university_id: universityId },
      order: { school_rank: 'ASC' },
    });
    return schemas.map((schema) => Profile.fromDB(schema));
  }

  async findTopRankedByUniversity(
    universityId: number,
    limit: number,
  ): Promise<Profile[]> {
    const schemas = await this.profileRepository.find({
      where: { university_id: universityId },
      order: { school_rank: 'ASC' },
      take: limit,
    });
    return schemas.map((schema) => Profile.fromDB(schema));
  }

  async save(profile: Profile): Promise<Profile> {
    const persistence = profile.toPersistence();
    const schema = await this.profileRepository.save(persistence);
    return Profile.fromDB(schema);
  }

  async delete(id: string): Promise<void> {
    await this.profileRepository.delete(id);
  }
}


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUniversityRepository } from '../../../application/ports/university.repository.interface';
import { University } from '../../../domain/entities/university.entity';
import { UniversitySchema } from '../schemas/university.schema';

@Injectable()
export class UniversityRepository implements IUniversityRepository {
  constructor(
    @InjectRepository(UniversitySchema)
    private readonly universityRepository: Repository<UniversitySchema>,
  ) { }

  async findById(id: number): Promise<University | null> {
    const schema = await this.universityRepository.findOne({
      where: { id },
    });

    return schema ? University.fromDB(schema) : null;
  }

  async findByDomain(domain: string): Promise<University | null> {
    const schema = await this.universityRepository.findOne({
      where: { domain },
    });

    return schema ? University.fromDB(schema) : null;
  }

  async findAll(): Promise<University[]> {
    const schemas = await this.universityRepository.find({
      order: { name: 'ASC' },
    });

    return schemas.map((schema) => University.fromDB(schema));
  }

  async save(university: University): Promise<University> {
    const persistence = university.toPersistence();
    const schema = await this.universityRepository.save(persistence);

    return University.fromDB(schema);
  }

  async delete(id: number): Promise<void> {
    await this.universityRepository.delete(id);
  }
}

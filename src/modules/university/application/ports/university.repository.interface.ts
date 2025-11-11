import { University } from '../../domain/entities/university.entity';

export interface IUniversityRepository {
  findById(id: number): Promise<University | null>;
  findByDomain(domain: string): Promise<University | null>;
  findAll(): Promise<University[]>;
  save(university: University): Promise<University>;
  delete(id: number): Promise<void>;
}


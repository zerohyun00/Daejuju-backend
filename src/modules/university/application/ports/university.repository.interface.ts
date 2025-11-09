import { University } from '../../domain/entities/university.entity';

/**
 * University Repository Interface
 * 의존성 역전 원칙(DIP)을 위한 인터페이스
 */
export interface IUniversityRepository {
  findById(id: number): Promise<University | null>;
  findByDomain(domain: string): Promise<University | null>;
  findAll(): Promise<University[]>;
  save(university: University): Promise<University>;
  delete(id: number): Promise<void>;
}

/**
 * DI 토큰
 */
export const UNIVERSITY_REPOSITORY = Symbol('UNIVERSITY_REPOSITORY');


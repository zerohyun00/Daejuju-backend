import { BaseEntity } from '../domain/base.entity';

/**
 * Base Repository Interface
 * 모든 Repository의 공통 인터페이스
 * 기본 CRUD 작업 정의
 */
export interface IBaseRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}


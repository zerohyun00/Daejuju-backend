import { User } from '../../domain/entities/user.entity';
import { IBaseRepository } from '../../../../shared/application/base.repository.interface';

export interface IUserRepository extends IBaseRepository<User> {
  /**
   * 이메일로 사용자 조회
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * 모든 사용자 조회
   */
  findAll(): Promise<User[]>;
}


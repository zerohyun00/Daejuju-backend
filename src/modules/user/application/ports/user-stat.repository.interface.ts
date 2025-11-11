import { UserStat } from '../../domain/entities/user-stat.entity';

export interface IUserStatRepository {

  findByUserId(userId: string): Promise<UserStat | null>;

  save(userStat: UserStat): Promise<UserStat>;

  delete(userId: string): Promise<void>;
}


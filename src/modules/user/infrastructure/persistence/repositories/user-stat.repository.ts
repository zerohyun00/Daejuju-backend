import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserStatRepository } from '../../../application/ports/user-stat.repository.interface';
import { UserStat } from '../../../domain/entities/user-stat.entity';
import { UserStatSchema } from '../schemas/user-stat.schema';

@Injectable()
export class UserStatRepository implements IUserStatRepository {
  constructor(
    @InjectRepository(UserStatSchema)
    private readonly userStatRepository: Repository<UserStatSchema>,
  ) { }

  async findByUserId(userId: string): Promise<UserStat | null> {
    const schema = await this.userStatRepository.findOne({
      where: { user_id: userId },
    });
    return schema ? UserStat.fromDB(schema) : null;
  }

  async save(userStat: UserStat): Promise<UserStat> {
    const persistence = userStat.toPersistence();
    const schema = await this.userStatRepository.save(persistence);
    return UserStat.fromDB(schema);
  }

  async delete(userId: string): Promise<void> {
    await this.userStatRepository.delete({ user_id: userId });
  }
}


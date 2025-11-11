import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../application/ports/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserSchema } from '../schemas/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
  ) { }

  async findById(id: string): Promise<User | null> {
    const schema = await this.userRepository.findOne({ where: { id } });
    return schema ? User.fromDB(schema) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.userRepository.findOne({ where: { email } });
    return schema ? User.fromDB(schema) : null;
  }

  async findAll(): Promise<User[]> {
    const schemas = await this.userRepository.find({
      order: { created_at: 'DESC' },
    });
    return schemas.map((schema) => User.fromDB(schema));
  }

  async save(user: User): Promise<User> {
    const persistence = user.toPersistence();
    const schema = await this.userRepository.save(persistence);
    return User.fromDB(schema);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}


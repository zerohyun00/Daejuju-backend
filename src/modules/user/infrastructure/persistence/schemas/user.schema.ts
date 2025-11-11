import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role, ROLE_ENUM } from '../../../domain/enums/role.enum';

@Entity('users')
export class UserSchema {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: ROLE_ENUM,
    default: ROLE_ENUM.USER,
    nullable: false,
  })
  role: Role;

  @Column({ name: 'refresh_token', type: 'varchar', length: 255, nullable: true })
  refresh_token: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}


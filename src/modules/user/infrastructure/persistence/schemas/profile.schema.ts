import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profiles')
export class ProfileSchema {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ name: 'user_id', type: 'char', length: 36, unique: true, nullable: false })
  user_id: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
  full_name: string | null;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatar_url: string | null;

  @Column({ name: 'university_id', type: 'int', nullable: false })
  university_id: number;

  @Column({ name: 'total_return', type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_return: number;

  @Column({ name: 'monthly_return', type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthly_return: number;

  @Column({ name: 'journal_count', type: 'int', default: 0 })
  journal_count: number;

  @Column({ name: 'avg_holding_days', type: 'int', default: 0 })
  avg_holding_days: number;

  @Column({ name: 'school_rank', type: 'int', nullable: true })
  school_rank: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}


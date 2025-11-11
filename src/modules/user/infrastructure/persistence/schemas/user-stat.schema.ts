import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_stats')
export class UserStatSchema {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  user_id: string;

  @Column({ name: 'total_posts', type: 'int', default: 0 })
  total_posts: number;

  @Column({ name: 'total_comments', type: 'int', default: 0 })
  total_comments: number;

  @Column({ name: 'total_likes_received', type: 'int', default: 0 })
  total_likes_received: number;

  @Column({ name: 'total_journal_entries', type: 'int', default: 0 })
  total_journal_entries: number;

  @Column({ name: 'streak_days', type: 'int', default: 0 })
  streak_days: number;

  @Column({ name: 'last_activity_date', type: 'date', nullable: true })
  last_activity_date: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}


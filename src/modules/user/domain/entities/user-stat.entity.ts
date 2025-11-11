
export class UserStat {
  private constructor(
    private readonly userId: string,
    private totalPosts: number,
    private totalComments: number,
    private totalLikesReceived: number,
    private totalJournalEntries: number,
    private streakDays: number,
    private lastActivityDate: Date | null,
    private updatedAt: Date,
  ) { }

  /**
   * 새로운 UserStat 생성
   */
  static create(userId: string): UserStat {
    return new UserStat(
      userId,
      0,
      0,
      0,
      0,
      0,
      null,
      new Date(),
    );
  }

  /**
   * DB에서 불러온 데이터로 UserStat 생성
   */
  static fromDB(data: {
    user_id: string;
    total_posts: number;
    total_comments: number;
    total_likes_received: number;
    total_journal_entries: number;
    streak_days: number;
    last_activity_date: Date | null;
    updated_at: Date;
  }): UserStat {
    return new UserStat(
      data.user_id,
      data.total_posts,
      data.total_comments,
      data.total_likes_received,
      data.total_journal_entries,
      data.streak_days,
      data.last_activity_date,
      data.updated_at,
    );
  }

  /**
   * 게시글 수 증가
   */
  incrementPosts(): void {
    this.totalPosts++;
    this.updateActivity();
  }

  /**
   * 댓글 수 증가
   */
  incrementComments(): void {
    this.totalComments++;
    this.updateActivity();
  }

  /**
   * 받은 좋아요 수 증가
   */
  incrementLikesReceived(): void {
    this.totalLikesReceived++;
    this.touch();
  }

  /**
   * 일지 작성 수 증가
   */
  incrementJournalEntries(): void {
    this.totalJournalEntries++;
    this.updateActivity();
  }

  /**
   * 활동 업데이트 (연속 일수 갱신)
   */
  private updateActivity(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!this.lastActivityDate) {
      this.streakDays = 1;
    } else {
      const lastDate = new Date(this.lastActivityDate);
      lastDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0) {
        // 같은 날 활동
        // streak 유지
      } else if (diffDays === 1) {
        // 연속 활동
        this.streakDays++;
      } else {
        // 연속 끊김
        this.streakDays = 1;
      }
    }

    this.lastActivityDate = new Date();
    this.touch();
  }

  /**
   * 업데이트 시간 갱신
   */
  private touch(): void {
    this.updatedAt = new Date();
  }

  /**
   * DB 저장용 데이터 변환
   */
  toPersistence() {
    return {
      user_id: this.userId,
      total_posts: this.totalPosts,
      total_comments: this.totalComments,
      total_likes_received: this.totalLikesReceived,
      total_journal_entries: this.totalJournalEntries,
      streak_days: this.streakDays,
      last_activity_date: this.lastActivityDate,
      updated_at: this.updatedAt,
    };
  }

  // Getters
  getUserId(): string {
    return this.userId;
  }

  getTotalPosts(): number {
    return this.totalPosts;
  }

  getTotalComments(): number {
    return this.totalComments;
  }

  getTotalLikesReceived(): number {
    return this.totalLikesReceived;
  }

  getTotalJournalEntries(): number {
    return this.totalJournalEntries;
  }

  getStreakDays(): number {
    return this.streakDays;
  }

  getLastActivityDate(): Date | null {
    return this.lastActivityDate;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}


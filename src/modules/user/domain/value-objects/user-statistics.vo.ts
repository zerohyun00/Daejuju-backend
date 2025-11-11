export class UserStatistics {
  constructor(
    private readonly totalReturn: number,
    private readonly monthlyReturn: number,
    private readonly journalCount: number,
    private readonly avgHoldingDays: number,
  ) { }

  /**
   * 기본 통계 생성 (초기값)
   */
  static createDefault(): UserStatistics {
    return new UserStatistics(0, 0, 0, 0);
  }

  /**
   * DB 데이터로 통계 생성
   */
  static fromDB(data: {
    total_return: number;
    monthly_return: number;
    journal_count: number;
    avg_holding_days: number;
  }): UserStatistics {
    return new UserStatistics(
      data.total_return,
      data.monthly_return,
      data.journal_count,
      data.avg_holding_days,
    );
  }

  /**
   * 새로운 통계로 업데이트
   */
  update(
    totalReturn: number,
    monthlyReturn: number,
    journalCount: number,
    avgHoldingDays: number,
  ): UserStatistics {
    return new UserStatistics(
      totalReturn,
      monthlyReturn,
      journalCount,
      avgHoldingDays,
    );
  }

  // Getters
  getTotalReturn(): number {
    return this.totalReturn;
  }

  getMonthlyReturn(): number {
    return this.monthlyReturn;
  }

  getJournalCount(): number {
    return this.journalCount;
  }

  getAvgHoldingDays(): number {
    return this.avgHoldingDays;
  }

  /**
   * Persistence 변환
   */
  toPersistence() {
    return {
      total_return: this.totalReturn,
      monthly_return: this.monthlyReturn,
      journal_count: this.journalCount,
      avg_holding_days: this.avgHoldingDays,
    };
  }
}


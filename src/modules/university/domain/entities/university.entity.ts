/**
 * University Entity
 * 대학교 도메인 엔티티
 */
export class University {
  private constructor(
    private readonly id: number,
    private name: string,
    private domain: string,
    private readonly createdAt: Date,
  ) { }

  /**
   * 새로운 University 생성 (DB 저장 전)
   */
  static create(
    name: string,
    domain: string,
  ): University {
    return new University(0, name, domain, new Date());
  }

  /**
   * DB에서 불러온 데이터로 University 생성
   */
  static fromDB(data: {
    id: number;
    name: string;
    domain: string;
    created_at: Date;
  }): University {
    return new University(
      data.id,
      data.name,
      data.domain,
      data.created_at,
    );
  }

  /**
   * 이메일 도메인 검증
   * @example
   * university.isValidEmailDomain('student@snu.ac.kr') // true
   * university.isValidEmailDomain('student@other.ac.kr') // false
   */
  isValidEmailDomain(email: string): boolean {
    const emailDomain = email.split('@')[1];
    return emailDomain === this.domain;
  }

  /**
   * DB 저장용 데이터 변환
   */
  toPersistence(): {
    id?: number;
    name: string;
    domain: string;
    created_at?: Date;
  } {
    const data: {
      id?: number;
      name: string;
      domain: string;
      created_at?: Date;
    } = {
      name: this.name,
      domain: this.domain,
    };

    if (this.id !== null) {
      data.id = this.id;
    }

    if (this.createdAt) {
      data.created_at = this.createdAt;
    }

    return data;

  }

  // Getters
  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDomain(): string {
    return this.domain;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}


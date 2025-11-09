import { InvalidArgumentException } from '../../../../shared/domain/exceptions/invalid-argument.exception';

/**
 * Email Domain Value Object
 * 대학 이메일 도메인을 표현하는 값 객체
 *
 * @example
 * const domain = new EmailDomain('snu.ac.kr');
 * domain.getValue(); // 'snu.ac.kr'
 * domain.isKoreanUniversity(); // true
 */
export class EmailDomain {
  private readonly value: string;

  constructor(domain: string) {
    this.validate(domain);
    this.value = domain.toLowerCase().trim();
  }

  /**
   * 도메인 검증
   */
  private validate(domain: string): void {
    if (!domain || domain.trim().length === 0) {
      throw new InvalidArgumentException('이메일 도메인은 필수입니다');
    }

    // 기본 도메인 형식 검증
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/;
    if (!domainPattern.test(domain)) {
      throw new InvalidArgumentException('유효하지 않은 도메인 형식입니다');
    }
  }

  /**
   * 특정 도메인과 일치하는지 확인
   */
  equals(other: EmailDomain): boolean {
    return this.value === other.value;
  }

  /**
   * 이메일이 이 도메인에 속하는지 확인
   */
  matchesEmail(email: string): boolean {
    const emailDomain = email.split('@')[1]?.toLowerCase();
    return emailDomain === this.value;
  }

  /**
   * 도메인 값 반환
   */
  getValue(): string {
    return this.value;
  }

  /**
   * 문자열 표현
   */
  toString(): string {
    return this.value;
  }
}

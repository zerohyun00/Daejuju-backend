import { InvalidArgumentException } from '../../../../shared/domain/exceptions/invalid-argument.exception';

/**
 * 인증 코드 Value Object
 */
export class VerificationCode {
  private readonly value: string;

  private constructor(code: string) {
    this.validate(code);
    this.value = code;
  }

  /**
   * 6자리 랜덤 코드 생성
   */
  static generate(): VerificationCode {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return new VerificationCode(code);
  }

  /**
   * 문자열에서 생성 (검증 포함)
   */
  static fromString(code: string): VerificationCode {
    return new VerificationCode(code);
  }

  /**
   * 코드 검증
   */
  private validate(code: string): void {
    if (!/^\d{6}$/.test(code)) {
      throw new InvalidArgumentException('인증 코드는 6자리 숫자여야 합니다');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: string | VerificationCode): boolean {
    const otherValue = typeof other === 'string' ? other : other.value;
    return this.value === otherValue;
  }

  toString(): string {
    return this.value;
  }
}


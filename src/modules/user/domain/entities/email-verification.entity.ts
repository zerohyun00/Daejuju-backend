import { VerificationCode } from '../value-objects/verification-code.vo';
import { InvalidArgumentException } from '../../../../shared/domain/exceptions/invalid-argument.exception';

/**
 * 이메일 인증 도메인 엔티티
 * Redis에 저장되지만 도메인 로직은 유지
 */
export class EmailVerification {
  private constructor(
    private readonly email: string,
    private readonly code: VerificationCode,
    private readonly createdAt: Date,
    private verified: boolean = false,
  ) { }

  /**
   * 새로운 이메일 인증 생성
   */
  static create(email: string): EmailVerification {
    const code = VerificationCode.generate();
    return new EmailVerification(
      email.toLowerCase().trim(),
      code,
      new Date(),
      false,
    );
  }

  /**
   * Redis 캐시에서 불러온 데이터로 생성
   */
  static fromCache(data: {
    email: string;
    code: string;
    createdAt: string;
    verified: boolean;
  }): EmailVerification {
    return new EmailVerification(
      data.email,
      VerificationCode.fromString(data.code),
      new Date(data.createdAt),
      data.verified,
    );
  }

  /**
   * 인증 코드 검증
   */
  verify(inputCode: string): void {
    if (this.verified) {
      throw new InvalidArgumentException('이미 인증된 이메일입니다');
    }

    if (!this.code.equals(inputCode)) {
      throw new InvalidArgumentException('잘못된 인증 코드입니다');
    }

    this.verified = true;
  }

  /**
   * 인증 여부 확인
   */
  isVerified(): boolean {
    return this.verified;
  }

  /**
   * 재발송 가능 여부 확인
   * @param cooldownSeconds 재발송 쿨다운 시간 (초)
   * @returns true면 재발송 가능, false면 아직 쿨다운 중
   */
  canResend(cooldownSeconds: number): boolean {
    const now = new Date();
    const elapsedSeconds = (now.getTime() - this.createdAt.getTime()) / 1000;
    return elapsedSeconds >= cooldownSeconds;
  }

  /**
   * 재발송까지 남은 시간 계산 (초)
   */
  getRemainingCooldown(cooldownSeconds: number): number {
    const now = new Date();
    const elapsedSeconds = (now.getTime() - this.createdAt.getTime()) / 1000;
    const remaining = Math.ceil(cooldownSeconds - elapsedSeconds);
    return Math.max(0, remaining);
  }

  /**
   * Redis 캐시 저장용 데이터 변환
   */
  toCache() {
    return {
      email: this.email,
      code: this.code.getValue(),
      createdAt: this.createdAt.toISOString(),
      verified: this.verified,
    };
  }

  // Getters
  getEmail(): string {
    return this.email;
  }

  getCode(): VerificationCode {
    return this.code;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}


import { EmailVerification } from '../../domain/entities/email-verification.entity';

/**
 * 이메일 인증 Repository 인터페이스 (Redis 추상화)
 */
export interface IEmailVerificationRepository {
  /**
   * Redis에 인증 데이터 저장 (TTL 포함)
   */
  save(verification: EmailVerification): Promise<void>;

  /**
   * 이메일로 인증 데이터 조회
   */
  findByEmail(email: string): Promise<EmailVerification | null>;

  /**
   * 인증 데이터 삭제
   */
  delete(email: string): Promise<void>;

  /**
   * 인증 완료 여부 확인
   */
  isVerified(email: string): Promise<boolean>;
}


/**
 * 이메일 발송 서비스 인터페이스
 */
export interface IEmailService {
  /**
   * 인증 이메일 발송
   */
  sendVerificationEmail(email: string, code: string): Promise<void>;

  /**
   * 회원가입 환영 이메일 발송
   */
  sendWelcomeEmail(email: string, name: string): Promise<void>;
}


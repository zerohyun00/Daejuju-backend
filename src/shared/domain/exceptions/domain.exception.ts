/**
 * Domain Exception
 * 도메인 레이어의 기본 예외 클래스
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    Error.captureStackTrace(this, this.constructor);
  }
}


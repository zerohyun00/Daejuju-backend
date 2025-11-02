import { DomainException } from './domain.exception';

/**
 * Invalid Argument Exception
 * 잘못된 인자가 전달되었을 때 발생
 * Value Object 검증 실패 시 주로 사용
 */
export class InvalidArgumentException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArgumentException';
  }
}


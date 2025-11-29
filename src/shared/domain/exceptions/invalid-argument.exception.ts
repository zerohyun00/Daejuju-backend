import { BadRequestException } from '@nestjs/common';

/**
 * Invalid Argument Exception
 * Value Object 검증 실패 시 주로 사용
 * 
 * HTTP 400 Bad Request로 자동 변환
 */
export class InvalidArgumentException extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArgumentException';
  }
}

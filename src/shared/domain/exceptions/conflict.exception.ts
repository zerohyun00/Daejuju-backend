import { ConflictException as NestConflictException } from '@nestjs/common';

/**
 * Conflict Exception
 * 
 * HTTP 409 Conflict로 자동 변환
 */
export class ConflictException extends NestConflictException {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictException';
  }
}

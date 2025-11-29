import { ForbiddenException as NestForbiddenException } from '@nestjs/common';

/**
 * Forbidden Exception
 * HTTP 403 Forbidden으로 자동 변환
 */
export class ForbiddenException extends NestForbiddenException {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenException';
  }
}

import { UnauthorizedException as NestUnauthorizedException } from '@nestjs/common';

/**
 * Unauthorized Exception
 * 
 * HTTP 401 Unauthorized로 자동 변환
 */
export class UnauthorizedException extends NestUnauthorizedException {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

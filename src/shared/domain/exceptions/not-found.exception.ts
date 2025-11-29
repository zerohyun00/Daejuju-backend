import { NotFoundException as NestNotFoundException } from '@nestjs/common';

/**
 * Not Found Exception
 *  
 * HTTP 404 Not Found로 자동 변환
 */
export class NotFoundException extends NestNotFoundException {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

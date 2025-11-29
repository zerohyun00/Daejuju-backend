import { ServiceUnavailableException as NestServiceUnavailableException } from '@nestjs/common';

/**
 * Service Unavailable Exception
 * 
 * HTTP 503 Service Unavailable로 자동 변환
 */
export class ServiceUnavailableException extends NestServiceUnavailableException {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceUnavailableException';
  }
}


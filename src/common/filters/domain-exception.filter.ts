import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../shared/domain/exceptions/domain.exception';
import { NotFoundException } from '../../shared/domain/exceptions/not-found.exception';
import { InvalidArgumentException } from '../../shared/domain/exceptions/invalid-argument.exception';

/**
 * Domain Exception Filter
 * 도메인 예외를 HTTP 응답으로 변환
 * 
 * @example
 * @UseFilters(DomainExceptionFilter)
 * export class AppModule {}
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.getHttpStatus(exception);
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.name,
      timestamp: new Date().toISOString(),
    });
  }

  private getHttpStatus(exception: DomainException): number {
    if (exception instanceof NotFoundException) {
      return HttpStatus.NOT_FOUND;
    }

    if (exception instanceof InvalidArgumentException) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}


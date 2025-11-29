import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HTTP Exception Filter
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const timestamp = new Date().toISOString();
    const path = request.url;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = '예상치 못한 오류가 발생했습니다.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;
    } else {
      // 일반 Error
      message = exception.message || '예상치 못한 오류가 발생했습니다.';
    }

    // 에러 로깅
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${status}`,
        (exception as any).cause?.stack || exception.stack,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${status} - ${message}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      path,
      timestamp,
    });
  }
}

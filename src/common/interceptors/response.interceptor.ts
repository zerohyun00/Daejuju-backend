import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  timestamp: string;
  path: string;
}

/**
 * Response Interceptor
 * 모든 응답을 일관된 형식으로 래핑
 * 
 * @example
 * @UseInterceptors(ResponseInterceptor)
 * export class AppModule {}
 * 
 * Response Format:
 * {
 *   data: { ... },
 *   timestamp: "2024-01-01T00:00:00.000Z",
 *   path: "/api/users"
 * }
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
        path,
      })),
    );
  }
}

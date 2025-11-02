import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Current User Decorator
 * JWT 인증 후 Request에서 현재 사용자 정보를 추출한다.
 * 
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

/**
 * User Payload Interface
 * JWT 토큰에 담길 사용자 정보
 */
export interface UserPayload {
  id: string;
  email: string;
  roles: string[];
}


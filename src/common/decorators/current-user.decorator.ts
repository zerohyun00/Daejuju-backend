import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // 특정 필드만 반환
    if (data) {
      return user?.[data];
    }

    // 전체 user 객체 반환
    return user;
  },
);

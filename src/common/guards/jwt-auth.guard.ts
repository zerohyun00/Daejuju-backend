import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * JWT Auth Guard
 * JWT 토큰 기반 인증 가드
 * 
 * TODO: JWT 인증 로직 구현 필요
 * - passport-jwt 설정
 * - JWT Strategy 구현
 * 
 * @example
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@CurrentUser() user: UserPayload) {
 *   return user;
 * }
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('인증 토큰이 없습니다');
    }

    // TODO: JWT 토큰 검증 로직 구현
    // 현재는 기본 구조만 제공

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}


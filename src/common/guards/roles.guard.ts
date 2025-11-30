import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../modules/user/domain/enums/role.enum';
import {
  ForbiddenException,
  UnauthorizedException
} from '../../shared/domain/exceptions';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 역할 제한이 없으면 통과
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 2. JWT Guard를 통해 검증된 사용자 정보 추출
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // JWT Guard가 먼저 실행되지 않았거나 인증 실패
    if (!user) {
      throw new UnauthorizedException('인증이 필요합니다');
    }

    // 3. 사용자 역할 확인
    const userRole = user.role;

    if (!userRole) {
      throw new ForbiddenException('사용자 역할 정보가 없습니다');
    }

    // 4. 필요한 역할과 사용자 역할 비교
    const hasRequiredRole = requiredRoles.includes(userRole);

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `이 작업은 ${requiredRoles.join(', ')} 권한이 필요합니다`,
      );
    }

    return true;
  }
}


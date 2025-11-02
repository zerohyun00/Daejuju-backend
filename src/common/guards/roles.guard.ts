import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

/**
 * Roles Guard
 * 사용자 역할 기반 인가 가드
 * 
 * @example
 * @SetMetadata('roles', ['admin'])
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Delete(':id')
 * deleteUser(@Param('id') id: string) {
 *   return this.userService.delete(id);
 * }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}


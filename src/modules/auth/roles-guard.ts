import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { ROLES_KEY } from './role-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) throw new ForbiddenException(`Bearer token is required`);

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new ForbiddenException({ message: 'User is not authorized' });
      }

      try {
        req.user = this.jwtService.verify(token);
      } catch (e) {
        throw new ForbiddenException({ message: 'Invalid token' });
      }

      return requiredRoles.includes(req.user.role);
    } catch (e) {
      throw e;
    }
  }
}

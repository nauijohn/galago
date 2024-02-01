import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger('RolesGuard');

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    this.logger.log('CanActivate...');

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = context.switchToHttp().getRequest() as RequestWithUser;
    if (!user) return true;

    this.logger.debug(`requiredRoles: ${requiredRoles}`);
    this.logger.debug(`user: ${user}`);

    if (!requiredRoles || requiredRoles.length === 0) return true;
    const isUserPermitted = requiredRoles.some((role) =>
      user.roles.some(
        (userRole) => userRole.toLowerCase() === role.toLowerCase(),
      ),
    );

    return isUserPermitted;
  }
}

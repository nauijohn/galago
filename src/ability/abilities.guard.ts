import { ForbiddenError } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC } from '../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../utils/my-logger.service';
import { CHECK_ABILITY, RequiredRule } from './abilities.decorator';
import { AbilityFactory } from './ability.factory';

@Injectable({ scope: Scope.REQUEST })
export class AbilitiesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: AbilityFactory,
    private readonly loggerService: MyLoggerService,
  ) {}

  canActivate(context: ExecutionContext) {
    this.loggerService.log('canActivate...');

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const { user } = context.switchToHttp().getRequest();
    if (!user) return true;

    const ability = this.abilityFactory.defineAbility(user);

    rules.forEach((rule) =>
      ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
    );

    return true;
  }
}

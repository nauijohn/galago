import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Role } from '../auth/enums/role.enum';
import { FacebookUser } from '../users/facebook-users/facebook-user.schema';
import { LocalUser } from '../users/local-users/local-user.schema';
import { MyLoggerService } from '../utils/my-logger.service';

// import { User } from '../users/user.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// class User {
//   id: string;
//   email: string;
//   roles: string[];
// }

export type Subjects =
  | InferSubjects<typeof LocalUser>
  | InferSubjects<typeof FacebookUser>
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(private readonly loggerService: MyLoggerService) {}

  defineAbility(user: LocalUser) {
    this.loggerService.log('defineAbility...');

    const { can, cannot, build } = new AbilityBuilder(
      PureAbility as AbilityClass<AppAbility>,
    );

    const userRoles = user.roles.map((role) => String(role));

    if (userRoles.includes(Role.Admin)) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, LocalUser);
      can(Action.Create, LocalUser);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

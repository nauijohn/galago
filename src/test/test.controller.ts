import { Request } from 'express';
import * as moment from 'moment';

import { HttpService } from '@nestjs/axios';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CheckAbilities } from '../ability/abilities.decorator';
import { Action } from '../ability/ability.factory';
import {
  Public,
  PublicAccessToken,
  PublicAuthenticated,
  PublicRefreshToken,
} from '../auth/decorators/is-public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { FacebookGuard } from '../auth/guards/facebook.guard';
import { LocalUser } from '../users/local-users/local-user.schema';
import { MyLoggerService } from '../utils/my-logger.service';
import { SecurityService } from '../utils/security.service';
import { UtilsService } from '../utils/utils.service';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('test')
@ApiTags('test')
export class TestController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly httpService: HttpService,
    private readonly utilsService: UtilsService,
    private readonly securityService: SecurityService,
  ) {}

  @Get('user')
  @Roles(Role.User)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    status: 200,
    description: 'test route for user role',
    type: 'object',
  })
  accessUserRole(@Req() req: RequestWithUser) {
    this.loggerService.log('accessUserRole...');
    this.loggerService.debug('req.isAuthenticated: ', req.isAuthenticated());
    this.loggerService.debug(`req.user: `, req.user);
    return 'accessed user role';
  }

  @Get('admin')
  @Roles(Role.Admin)
  @ApiBearerAuth('JWT-auth')
  accessAdminRole() {
    this.loggerService.log('accessAdminRole...');
    return 'accessed admin role';
  }

  @Get('public')
  @PublicAccessToken()
  @PublicRefreshToken()
  @PublicAuthenticated()
  accessPublic() {
    this.loggerService.log('accessPublic...');
    const testDate = '1992-11-18';
    const x = moment(testDate).format('YYYY-MM-DDTHH:mm:SS');
    return 'accessed public';
  }

  @Get('/facebook')
  @PublicAccessToken()
  @PublicRefreshToken()
  @PublicAuthenticated()
  @UseGuards(FacebookGuard)
  async facebookTest() {
    return 'test';
  }

  @Get('/abilities')
  @CheckAbilities({ action: Action.Create, subject: LocalUser })
  @Roles(Role.Admin)
  async abilitiesTest() {
    this.loggerService.log('abilitiesTest...');
    return 'abilitiesTest';
  }

  @Get('security')
  @Public()
  async securityTest() {
    const encrypted = await this.securityService.encryptWordForURL(
      'GLGFMY1706175416153',
    );
    return await this.securityService.decryptWordForURL(encrypted);
  }
}

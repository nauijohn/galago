import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Public } from '../auth/decorators/is-public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PaginationQueryDto } from '../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../utils/my-logger.service';
import { CredentialsService } from './credentials.service';
import { CreateCredentialRequestDto } from './dtos/request/create-credential-request.dto';
import { UpdateCredentialRequestDto } from './dtos/request/update-credential-request.dto';
import { Providers } from './providers.enum';

@Public()
@Roles(Role.Admin)
@Controller('credentials')
export class CredentialsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly credentialsService: CredentialsService,
  ) {}

  @Post()
  async create(@Body() requestDto: CreateCredentialRequestDto) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.credentialsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.credentialsService.fetchAll(queryDto),
    };
  }

  @Get('provider/:provider')
  async fetchByProvider(@Param('provider') provider: Providers) {
    this.loggerService.log('fetchByProvider...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.credentialsService.fetchByProvider(provider),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.credentialsService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() requestDto: UpdateCredentialRequestDto) {
    this.loggerService.log('update...');
    const isSuccess = await this.credentialsService.update(requestDto);
    return {
      statusCode: isSuccess ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
      message: isSuccess ? 'Update successful!' : 'Update failed!',
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.credentialsService.deleteById(id),
    };
  }
}

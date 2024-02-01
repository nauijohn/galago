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
import { PaginationQueryDto } from '../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreateIataCodeRequestDto } from './dtos/request/create-iata-code-request.dto';
import { UpdateIataCodeRequestDto } from './dtos/request/update-iata-code-request.dto';
import { IataCodesService } from './iata-codes.service';

@Public()
@Controller('iata-codes')
export class IataCodesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly iataCodesService: IataCodesService,
  ) {}

  @Post()
  async create(@Body() requestDto: CreateIataCodeRequestDto) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.iataCodesService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.iataCodesService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.iataCodesService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() requestDto: UpdateIataCodeRequestDto) {
    this.loggerService.log('update...');
    const isSuccess = await this.iataCodesService.update(requestDto);
    if (!isSuccess)
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Update failed!',
      };
    return {
      statusCode: HttpStatus.OK,
      message: 'Update successful!',
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    const message = await this.iataCodesService.deleteById(id);
    return {
      statusCode: HttpStatus.OK,
      message,
    };
  }
}

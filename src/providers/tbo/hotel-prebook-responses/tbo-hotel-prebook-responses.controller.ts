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

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateTboHotelPrebookResponseRequestDto } from './dtos/request/create-tbo-hotel-prebook-response-request.dto';
import { UpdateTboHotelPrebookResponseRequestDto } from './dtos/request/update-tbo-hotel-prebook-response-request.dto';
import { TboHotelPrebookResponsesService } from './tbo-hotel-prebook-responses.service';

@Controller()
export class TboHotelPrebookResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly tboHotelPrebookResponsesService: TboHotelPrebookResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateTboHotelPrebookResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.tboHotelPrebookResponsesService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelPrebookResponsesService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelPrebookResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateTboHotelPrebookResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelPrebookResponsesService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.tboHotelPrebookResponsesService.deleteById(id),
    };
  }
}

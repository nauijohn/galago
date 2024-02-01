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
import { CreateTboHotelBookResponseRequestDto } from './dtos/request/create-tbo-hotel-book-response-request.dto';
import { UpdateTboHotelBookResponseRequestDto } from './dtos/request/update-tbo-hotel-book-response-request.dto';
import { TboHotelBookResponsesService } from './tbo-hotel-book-responses.service';

@Controller()
export class TboHotelBookResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly tboHotelBookResponsesService: TboHotelBookResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateTboHotelBookResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.tboHotelBookResponsesService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelBookResponsesService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelBookResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateTboHotelBookResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelBookResponsesService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.tboHotelBookResponsesService.deleteById(id),
    };
  }
}

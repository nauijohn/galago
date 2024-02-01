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
import { CreateTboHotelDetailRequestDto } from './dtos/request/create-tbo-hotel-detail-request.dto';
import { UpdateTboHotelDetailRequestDto } from './dtos/request/update-tbo-hotel-detail.request.dto';
import { TboHotelDetailsService } from './tbo-hotel-details.service';

@Controller()
export class TboHotelDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly tboHotelDetailsService: TboHotelDetailsService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateTboHotelDetailRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.tboHotelDetailsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelDetailsService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateTboHotelDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelDetailsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.tboHotelDetailsService.deleteById(id),
    };
  }
}

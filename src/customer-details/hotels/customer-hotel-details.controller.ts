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

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CustomerHotelDetailsService } from './customer-hotel-details.service';
import { CreateCustomerHotelDetailRequestDto } from './dtos/request/create-customer-hotel-detail-request.dto';
import { UpdateCustomerHotelDetailRequestDto } from './dtos/request/update-customer-hotel-detail-request.dto';

@Controller()
export class CustomerHotelDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly customerHotelDetailsService: CustomerHotelDetailsService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateCustomerHotelDetailRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.customerHotelDetailsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerHotelDetailsService.fetchAll(queryDto),
    };
  }

  @Get('all-details')
  async fetchByAllDetails(
    @Body()
    requestDto: CreateCustomerHotelDetailRequestDto,
  ) {
    this.loggerService.log('fetchByAllDetails...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerHotelDetailsService.fetchByAllDetails(
        requestDto,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerHotelDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateCustomerHotelDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerHotelDetailsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.customerHotelDetailsService.deleteById(id),
    };
  }
}

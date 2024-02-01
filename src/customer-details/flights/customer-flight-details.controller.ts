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
import { CustomerFlightDetailsService } from './customer-flight-details.service';
import { CreateCustomerFlightDetailRequestDto } from './dtos/request/create-customer-flight-detail-request.dto';
import { UpdateCustomerFlightDetailRequestDto } from './dtos/request/update-customer-flight-detail-request.dto';

@Controller()
export class CustomerFlightDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly customerFlightDetailsService: CustomerFlightDetailsService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateCustomerFlightDetailRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.customerFlightDetailsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.customerFlightDetailsService.fetchAll(queryDto),
    };
  }

  @Get('all-details')
  async fetchByAllDetails(
    @Body()
    requestDto: CreateCustomerFlightDetailRequestDto,
  ) {
    this.loggerService.log('fetchByAllDetails...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.customerFlightDetailsService.fetchByAllDetails(
        requestDto,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerFlightDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateCustomerFlightDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerFlightDetailsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.customerFlightDetailsService.deleteById(id),
    };
  }
}

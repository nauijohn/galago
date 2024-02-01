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
import { CreatePassengerDetailRequestDto } from './dtos/request/create-passenger-detail-request.dto';
import { UpdatePassengerDetailRequestDto } from './dtos/request/update-passenger-detail-request.dto';
import { PassengerDetailsService } from './passenger-details.service';

@Controller()
export class PassengerDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly passengerDetailsService: PassengerDetailsService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreatePassengerDetailRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.passengerDetailsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.passengerDetailsService.fetchAll(queryDto),
    };
  }

  @Get('booking/:id')
  async fetchAllByBookingFlightsId(
    @Param('id', ParseIntPipe) bookingFlightsId: number,
  ) {
    this.loggerService.log('fetchAllByBookingFlightsId...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.passengerDetailsService.fetchAllByBookingFlightsId(
        bookingFlightsId,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.passengerDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdatePassengerDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.passengerDetailsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.passengerDetailsService.deleteById(id),
    };
  }
}

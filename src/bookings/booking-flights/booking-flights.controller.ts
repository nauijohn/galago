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
import { BookingFlightsService } from './booking-flights.service';
import { CreateBookingFlightRequestDto } from './dtos/request/create-booking-flight-request.dto';
import { CreateOneWayBookingFlightRequestDto } from './dtos/request/create-one-way-booking-flight-request.dto';
import { CreateRoundtripV2BookingFlightRequestDto } from './dtos/request/create-roundtip-v2-booking-flight-request.dto';
import { CreateRoundtripBookingFlightRequestDto } from './dtos/request/create-roundtrip-booking-flight-request.dto';
import { UpdateBookingFlightRequestDto } from './dtos/request/update-booking-flight-request.dto';

@Controller()
export class BookingFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly bookingFlightsService: BookingFlightsService,
  ) {}

  @Post()
  async create(@Body() requestDto: CreateBookingFlightRequestDto) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.bookingFlightsService.create(requestDto),
    };
  }

  @Post('one-way')
  async createOneWay(
    @Body()
    requestDto: CreateOneWayBookingFlightRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.bookingFlightsService.createOneWay(requestDto),
    };
  }

  @Post('roundtrip')
  async createRoundtripV1(
    @Body()
    requestDto: CreateRoundtripBookingFlightRequestDto,
  ) {
    this.loggerService.log('createRoundtripV1...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.bookingFlightsService.createRoundtripV1(requestDto),
    };
  }

  @Post('v2/roundtrip')
  async createRoundtripV2(
    @Body()
    requestDto: CreateRoundtripV2BookingFlightRequestDto,
  ) {
    this.loggerService.log('createRoundtripV2...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.bookingFlightsService.createRoundtripV2(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.bookingFlightsService.fetchAll(queryDto),
    };
  }

  // @Get('payment-reference/:id')
  // async fetchByPaymentReferenceId(@Param('id') id: string) {
  //   this.loggerService.log('fetchByPaymentReferenceId...');
  //   return {
  //     statusCode: HttpStatus.OK,
  //     data: await this.bookingFlightsService.fetchByPaymentReferenceId(id),
  //   };
  // }

  // @Get('payment-intent/:id')
  // async fetchAllByPaymentIntentId(@Param('id') paymentIntentId: string) {
  //   this.loggerService.log('fetchAllByPaymentIntentId...');
  //   return {
  //     statusCode: HttpStatus.OK,
  //     data: await this.bookingFlightsService.fetchAllByPaymentIntentId(
  //       paymentIntentId,
  //     ),
  //   };
  // }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.bookingFlightsService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() requestDto: UpdateBookingFlightRequestDto) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.bookingFlightsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.bookingFlightsService.deleteById(id),
    };
  }
}

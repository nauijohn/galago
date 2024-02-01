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
import { ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreatePaymentFlightRequestDto } from './dtos/request/create-payment-flight-request.dto';
import { UpdatePaymentFlightRequestDto } from './dtos/request/update-payment-flight-request.dto';
import { PaymentFlightsService } from './payment-flights.service';

@Controller()
@ApiTags('Payments')
export class PaymentFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly paymentFlightsService: PaymentFlightsService,
  ) {}

  @Post()
  async create(@Body() requestDto: CreatePaymentFlightRequestDto) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.paymentFlightsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentFlightsService.fetchAll(queryDto),
    };
  }

  @Get('promo-codes/:promoCode')
  async fetchAllByPromoCode(@Param('promoCode') promoCode: string) {
    this.loggerService.log('fetchAllByPromoCode...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentFlightsService.fetchAllByPromoCode(promoCode),
    };
  }

  @Get('reference/:id')
  async fetchByReferenceNumber(@Param('id') id: string) {
    this.loggerService.log('fetchByReferenceNumber...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentFlightsService.fetchByReferenceNumber(id),
    };
  }

  @Get('payment-intent/:id')
  async findPaymentIntentById(@Param('id') id: string) {
    this.loggerService.log('getPaymentIntentById...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentFlightsService.findPaymentIntentById(id),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentFlightsService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() requestDto: UpdatePaymentFlightRequestDto) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentFlightsService.update(requestDto),
    };
  }

  @Put('status/paid/:paymentIntentId')
  async updateStatusToPaidByPaymentIntentId(
    @Param('paymentIntentId') paymentIntentId: string,
  ) {
    this.loggerService.log('updateStatusToPaidByPaymentIntentId...');

    const isSuccess =
      await this.paymentFlightsService.updateStatusToPaidByPaymentIntentId(
        paymentIntentId,
      );

    return {
      statusCode: isSuccess ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
      message: isSuccess
        ? 'Update to Paid status successful!'
        : 'Update to Paid status failed!',
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.paymentFlightsService.deleteById(id),
    };
  }
}

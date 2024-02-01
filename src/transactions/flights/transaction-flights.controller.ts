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
import { CreateTransactionFlightRequestDto } from './dtos/request/create-transaction-flight-request.dto';
import { UpdateTransactionFlightRequestDto } from './dtos/request/update-transaction-flight-request.dto';
import { TransactionFlightsService } from './transaction-flights.service';

@Controller()
export class TransactionFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly transactionFlightsService: TransactionFlightsService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateTransactionFlightRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.transactionFlightsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.fetchAll(queryDto),
    };
  }

  @Get('transaction/:id')
  async fetchByTransactionId(@Param('id') id: string) {
    this.loggerService.log('fetchByTransactionId...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.fetchByTransactionId(id),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.fetchById(id),
    };
  }

  @Get('payment-reference/:id')
  async fetchByPaymentReferenceNumber(@Param('id') id: string) {
    this.loggerService.log('fetchByPaymentReferenceNumber...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.fetchByPaymentReferenceNumber(
        id,
      ),
    };
  }

  @Get('payment-intent/:id')
  async fetchByPaymentIntentId(@Param('id') id: string) {
    this.loggerService.log('fetchByPaymentIntentId...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.fetchByPaymentIntentId(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateTransactionFlightRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.transactionFlightsService.deleteById(id),
    };
  }
}

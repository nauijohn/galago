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
import { CreatePaymentHotelsRequestDto } from './dtos/request/create-payment-hotels-request.dto';
import { UpdatePaymentHotelsRequestDto } from './dtos/request/update-payment-hotels-request.dto';
import { PaymentHotelsService } from './payment-hotels.service';

@Controller()
export class PaymentHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly paymentHotelsService: PaymentHotelsService,
  ) {}

  @Post()
  async create(@Body() requestDto: CreatePaymentHotelsRequestDto) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.paymentHotelsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentHotelsService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() requestDto: UpdatePaymentHotelsRequestDto) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentHotelsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.paymentHotelsService.deleteById(id),
    };
  }

  @Get('payment-intent/:id')
  async findPaymentIntentById(@Param('id') id: string) {
    this.loggerService.log('getPaymentIntentById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentHotelsService.findPaymentIntentById(id),
    };
  }

  @Put('status/paid/:paymentIntentId')
  async updateStatusToPaidByPaymentIntentId(
    @Param('paymentIntentId') paymentIntentId: string,
  ) {
    this.loggerService.log('updateStatusToPaidByPaymentIntentId...');

    const isSuccess =
      await this.paymentHotelsService.updateStatusToPaidByPaymentIntentId(
        paymentIntentId,
      );

    return {
      statusCode: isSuccess ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
      message: isSuccess
        ? 'Update to Paid status successful!'
        : 'Update to Paid status failed!',
    };
  }
}

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
import { CreateTransactionHotelRequestDto } from './dtos/request/create-transaction-hotel-request.dto';
import { UpdateTransactionHotelRequestDto } from './dtos/request/update-transaction-hotel-request.dto';
import { TransactionHotelsService } from './transaction-hotels.service';

@Controller()
export class TransactionHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly transactionHotelsService: TransactionHotelsService,
  ) {}

  @Post()
  async create(@Body() requestDto: CreateTransactionHotelRequestDto) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.transactionHotelsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionHotelsService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() requestDto: UpdateTransactionHotelRequestDto) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionHotelsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.transactionHotelsService.deleteById(id),
    };
  }
}

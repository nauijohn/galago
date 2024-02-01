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
import { CreateMystiflyFlightRevalidationResponseRequestDto } from './dtos/request/create-mystifly-flight-revalidation-response-request.dto';
import { UpdateMystiflyFlightRevalidationResponseRequestDto } from './dtos/request/update-mystifly-flight-revalidation-response-request.dto';
import { MystiflyFlightRevalidationResponsesService } from './mystifly-flight-revalidation-responses.service';

@Controller()
export class MystiflyFlightRevalidationResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly mystiflyFlightRevalidationResponsesService: MystiflyFlightRevalidationResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateMystiflyFlightRevalidationResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightRevalidationResponsesService.create(
        requestDto,
      ),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightRevalidationResponsesService.fetchAll(
        queryDto,
      ),
    };
  }

  @Get('transaction/:id')
  async fetchAllByTransactionFlightId(
    @Param('id', ParseIntPipe) transactionFlightId: number,
  ) {
    this.loggerService.log('fetchAllByTransactionFlightId...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightRevalidationResponsesService.fetchAllByTransactionFlightId(
        transactionFlightId,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightRevalidationResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateMystiflyFlightRevalidationResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightRevalidationResponsesService.update(
        requestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.mystiflyFlightRevalidationResponsesService.deleteById(
        id,
      ),
    };
  }
}

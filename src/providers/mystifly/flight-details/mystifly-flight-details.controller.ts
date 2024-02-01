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
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightDetailRequestDto } from './dtos/request/create-mystifly-flight-detail-request.dto';
import { UpdateMystiflyFlightDetailRequestDto } from './dtos/request/update-mystifly-flight-detail-request.dto';
import { MystiflyFlightDetailsService } from './mystifly-flight-details.service';

@Controller()
@ApiTags('mystifly')
@ApiExcludeController()
export class MystiflyFlightDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly mystiflyFlightDetailsService: MystiflyFlightDetailsService,
  ) {}

  @Post()
  async create(@Body() requestDto: CreateMystiflyFlightDetailRequestDto) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightDetailsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.fetchAll(queryDto),
    };
  }

  @Get('provider-reference/:id')
  async fetchByProviderReference(@Param('id') providerReference: string) {
    this.loggerService.log('fetchByProviderReference...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.fetchByProviderReference(
        providerReference,
      ),
    };
  }

  @Get('payment-reference/:id')
  async fetchByPaymentReference(@Param('id') paymentReference: string) {
    this.loggerService.log('fetchByPaymentReference...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.fetchByPaymentReference(
        paymentReference,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateMystiflyFlightDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.mystiflyFlightDetailsService.deleteById(id),
    };
  }
}

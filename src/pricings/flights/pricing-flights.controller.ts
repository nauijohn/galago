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

import { Public } from '../../auth/decorators/is-public.decorator';
import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreatePricingFlightRequestDto } from './dtos/request/create-pricing-flight-request.dto';
import { UpdatePricingFlightRequestDto } from './dtos/request/update-pricing-flight-request.dto';
import { PricingFlightsService } from './pricing-flights.service';

@Public()
@Controller()
export class PricingFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly pricingFlightsService: PricingFlightsService,
  ) {}

  @Post()
  async create(@Body() requestDto: CreatePricingFlightRequestDto) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.pricingFlightsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.fetchAll(queryDto),
    };
  }

  @Get('iata-code')
  async fetchAllByIataCode() {
    this.loggerService.log('fetchAllByIataCode...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.fetchAllByIataCode(),
    };
  }

  @Get('cabin-class-iata-code')
  async fetchAllSortByCabinClassSortByIataCode() {
    this.loggerService.log('fetchAllSortByCabinClassSortByIataCode...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.fetchAllSortByCabinClassSortByIataCode(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() requestDto: UpdatePricingFlightRequestDto) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.pricingFlightsService.deleteById(id),
    };
  }
}

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
import { CreatePricingHotelRequestDto } from './dtos/request/create-pricing-hotel-request.dto';
import { UpdatePricingHotelRequestDto } from './dtos/request/update-pricing-hotel-request.dto';
import { PricingHotelsService } from './pricing-hotels.service';

@Public()
@Controller()
export class PricingHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly pricingHotelsService: PricingHotelsService,
  ) {}

  @Post()
  async create(@Body() requestDto: CreatePricingHotelRequestDto) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.pricingHotelsService.create(requestDto),
    };
  }

  @Get('rating')
  async fetchAllSortedByRating() {
    this.loggerService.log('fetchAllSortedByRating...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingHotelsService.fetchAllSortedByRating(),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingHotelsService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() requestDto: UpdatePricingHotelRequestDto) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingHotelsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.pricingHotelsService.deleteById(id),
    };
  }
}

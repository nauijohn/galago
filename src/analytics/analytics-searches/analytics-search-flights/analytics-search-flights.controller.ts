import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { AnalyticsSearchFlightsService } from './analytics-search-flights.service';
import { CreateAnalyticsSearchFlightRequestDto } from './dtos/request/create-analytics-search-flight-request.dto';
import { UpdateAnalyticsSearchFlightRequestDto } from './dtos/request/update-analytics-search-flight-request.dto';

@Controller()
export class AnalyticsSearchFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly analyticsSearchFlightsService: AnalyticsSearchFlightsService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateAnalyticsSearchFlightRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.analyticsSearchFlightsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.analyticsSearchFlightsService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id') id: string) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.analyticsSearchFlightsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateAnalyticsSearchFlightRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.analyticsSearchFlightsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.analyticsSearchFlightsService.deleteById(id),
    };
  }
}

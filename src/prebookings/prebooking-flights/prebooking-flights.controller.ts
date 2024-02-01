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
import { CreateOneWayPrebookingFlightRequestDto } from './dtos/request/create-one-way-prebooking-flight-request.dto';
import { CreatePrebookingFlightRequestDto } from './dtos/request/create-prebooking-flight-request.dto';
import {
  CreateRoundtripPrebookingFlightRequestDto,
  CreateRoundtripV2PrebookingFlightRequestDto,
} from './dtos/request/create-roundtrip-prebooking-flight-request.dto';
import { UpdatePrebookingFlightRequestDto } from './dtos/request/update-prebooking-flight-request.dto';
import { PrebookingFlightsService } from './prebooking-flights.service';

@Controller()
export class PrebookingFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly prebookingFlightsService: PrebookingFlightsService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreatePrebookingFlightRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.prebookingFlightsService.create(requestDto),
    };
  }

  @Post('one-way')
  async createOneWay(
    @Body()
    requestDto: CreateOneWayPrebookingFlightRequestDto,
  ) {
    this.loggerService.log('createOneWay...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.prebookingFlightsService.createOneWay(requestDto),
    };
  }

  @Post('roundtrip')
  async createRoundtrip(
    @Body()
    requestDto: CreateRoundtripPrebookingFlightRequestDto,
  ) {
    this.loggerService.log('createRoundtrip...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.prebookingFlightsService.createRoundtrip(requestDto),
    };
  }

  @Post('v2/roundtrip')
  async createRoundtripV2(
    @Body()
    requestDto: CreateRoundtripV2PrebookingFlightRequestDto,
  ) {
    this.loggerService.log('createRoundtripV2...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.prebookingFlightsService.createRoundtripV2(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingFlightsService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingFlightsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdatePrebookingFlightRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingFlightsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.prebookingFlightsService.deleteById(id),
    };
  }
}

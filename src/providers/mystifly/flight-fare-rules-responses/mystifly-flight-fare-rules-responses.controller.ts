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
import { CreateMystiflyFlightFareRulesResponseRequestDto } from './dtos/request/create-mystifly-flight-fare-rules-response-request.dto';
import { CreateMystiflyFlightRoundtripFareRulesResponseRequestDto } from './dtos/request/create-mystifly-flight-roundtrip-fare-rules-response-request.dto';
import { UpdateMystiflyFlightFareRulesResponseRequestDto } from './dtos/request/update-mystifly-flight-fare-rules-response-request.dto';
import { MystiflyFlightFareRulesResponsesService } from './mystifly-flight-fare-rules-responses.service';

@Controller()
export class MystiflyFlightFareRulesResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly mystiflyFlightFareRulesResponsesService: MystiflyFlightFareRulesResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightFareRulesResponsesService.create(
        requestDto,
      ),
    };
  }

  @Post('one-way')
  async createOneWay(
    @Body()
    requestDto: CreateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('createOneWay...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightFareRulesResponsesService.createOneWay(
        requestDto,
      ),
    };
  }

  @Post('roundtrip')
  async createRoundtrip(
    @Body()
    requestDto: CreateMystiflyFlightRoundtripFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('createRoundtrip...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightFareRulesResponsesService.createRoundtrip(
        requestDto,
      ),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightFareRulesResponsesService.fetchAll(
        queryDto,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightFareRulesResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightFareRulesResponsesService.update(
        requestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.mystiflyFlightFareRulesResponsesService.deleteById(
        id,
      ),
    };
  }
}

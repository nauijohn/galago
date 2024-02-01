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
import { CreateMystiflyFlightBookResponseRequestDto } from './dtos/request/create-mystifly-flight-book-response-request.dto';
import { UpdateMystiflyFlightBookResponseRequestDto } from './dtos/request/update-mystifly-flight-book-response-request.dto';
import { MystiflyFlightBookResponsesService } from './mystifly-flight-book-responses.service';

@Controller()
export class MystiflyFlightBookResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly mystiflyFlightBookResponsesService: MystiflyFlightBookResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateMystiflyFlightBookResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightBookResponsesService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightBookResponsesService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightBookResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateMystiflyFlightBookResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightBookResponsesService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.mystiflyFlightBookResponsesService.deleteById(id),
    };
  }
}

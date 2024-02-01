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
import { CreatePrebookingHotelRequestDto } from './dtos/request/create-prebooking-hotel-request.dto';
import { UpdatePrebookingHotelRequestDto } from './dtos/request/update-prebooking-hotel-request.dto';
import { PrebookingHotelsService } from './prebooking-hotels.service';

@Controller()
export class PrebookingHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly prebookingHotelsService: PrebookingHotelsService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreatePrebookingHotelRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.prebookingHotelsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingHotelsService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdatePrebookingHotelRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingHotelsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.prebookingHotelsService.deleteById(id),
    };
  }
}

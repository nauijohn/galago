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

import { PaginationQueryDto } from '../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreatePromoCodeRequestDto } from './dtos/request/create-promo-code-request.dto';
import { UpdatePromoCodeRequestDto } from './dtos/request/update-promo-code-request.dto';
import { PromoCodesService } from './promo-codes.service';

@Controller()
export class PromoCodesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly promoCodesService: PromoCodesService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreatePromoCodeRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.promoCodesService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.promoCodesService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.promoCodesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdatePromoCodeRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.promoCodesService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.promoCodesService.deleteById(id),
    };
  }
}

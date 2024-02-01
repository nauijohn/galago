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

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateScrappingsTboHotelRequestDto } from './dtos/request/create-scrappings-tbo-hotel-request.dto';
import { UpdateScrappingsTboHotelRequestDto } from './dtos/request/update-scrappings-tbo-hotel-request.dto';
import { ScrappingsTboHotelsService } from './scrappings-tbo-hotels.service';

@Controller()
export class ScrappingsTboHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly scrappingsTboHotelsService: ScrappingsTboHotelsService,
  ) {}

  @Post()
  async create(
    @Body()
    requestDto: CreateScrappingsTboHotelRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.scrappingsTboHotelsService.create(requestDto),
    };
  }

  @Get()
  async fetchAll(@Query() queryDto: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.scrappingsTboHotelsService.fetchAll(queryDto),
    };
  }

  @Get(':id')
  async fetchById(@Param('id') id: string) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.scrappingsTboHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    requestDto: UpdateScrappingsTboHotelRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.scrappingsTboHotelsService.update(requestDto),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.scrappingsTboHotelsService.deleteById(id),
    };
  }

  @Post('scrape-tbo-hotels-by-country-code')
  async scrapeTboHotelsByCountryCode(@Body('countryCode') countryCode: string) {
    this.loggerService.log('scrapeTboHotelsByCountryCode...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.scrappingsTboHotelsService.scrapeTboHotelsByCountryCode(
        countryCode,
      ),
    };
  }

  @Post('scrape-tbo-hotels')
  async scrapeTboHotels() {
    this.loggerService.log('scrapeTboHotels...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.scrappingsTboHotelsService.scrapeTboHotels(),
    };
  }
}

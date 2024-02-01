import { Cache } from 'cache-manager';
import * as _ from 'lodash';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreatePricingHotelRequestDto } from './dtos/request/create-pricing-hotel-request.dto';
import { UpdatePricingHotelRequestDto } from './dtos/request/update-pricing-hotel-request.dto';
import { PricingHotel } from './pricing-hotel.entity';
import { PricingHotelsRepository } from './pricing-hotels.repository';

@Injectable()
export class PricingHotelsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly pricingHotelsRepository: PricingHotelsRepository,
  ) {}

  async create(requestDto: CreatePricingHotelRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreatePricingHotelRequestDto,
      PricingHotel,
    );
    return await this.pricingHotelsRepository.create(entity);
  }

  async fetchAll(): Promise<PricingHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PricingHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.pricingHotelsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.pricingHotelsRepository.fetchAll(queryDto);
    }
  }

  async fetchAllSortedByRating() {
    this.loggerService.log('fetchAllSortedByRating...');
    const entites = await this.pricingHotelsRepository.fetchAll();

    const mappedPricings = entites.map<{
      fixedAmount: number;
      percentage: number;
      rating: number;
      priceMargin: string;
    }>((entity) => {
      delete entity.createdAt;
      delete entity.updatedAt;
      delete entity.id;
      return { ...entity };
    });

    const sortedByRatingObj = _.mapValues(
      _.groupBy(mappedPricings, 'rating'),
      (clist) => clist.map((car) => _.omit(car, 'rating')),
    );

    const result: {
      [x: string]: {
        fixedAmount: number;
        percentage: number;
        priceMargin: string;
      };
    } = {};

    for (const key in sortedByRatingObj) {
      if (Object.prototype.hasOwnProperty.call(sortedByRatingObj, key)) {
        result[key] = sortedByRatingObj[key][0];
      }
    }

    return result;
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.pricingHotelsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdatePricingHotelRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdatePricingHotelRequestDto,
      PricingHotel,
    );

    const [result] = await Promise.all([
      this.pricingHotelsRepository.update(entity),
      this.cacheManager.reset(),
    ]);

    return result;
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.pricingHotelsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}

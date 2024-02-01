import { Cache } from 'cache-manager';
import * as _ from 'lodash';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { IataCode } from '../../iataCodes/iata-code.entity';
import { IataCodesService } from '../../iataCodes/iata-codes.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CabinClass } from './cabin-class.enum';
import { CreatePricingFlightRequestDto } from './dtos/request/create-pricing-flight-request.dto';
import { UpdatePricingFlightRequestDto } from './dtos/request/update-pricing-flight-request.dto';
import { PriceMargin } from './price-margin.enum';
import { PricingFlight } from './pricing-flight.entity';
import { PricingFlightsRepository } from './pricing-flights.repository';

@Injectable()
export class PricingFlightsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly pricingFlightsRepository: PricingFlightsRepository,
    private readonly iataCodesService: IataCodesService,
  ) {}

  async create(requestDto: CreatePricingFlightRequestDto) {
    this.loggerService.log('create...');

    await this.determinePricingForCabinClassForIataCodeExists(
      requestDto.iataCode,
      requestDto.cabinClass,
    );

    const entity = this.classMapper.map(
      requestDto,
      CreatePricingFlightRequestDto,
      PricingFlight,
    );

    return await this.pricingFlightsRepository.create(entity);
  }

  async fetchAll(): Promise<PricingFlight[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PricingFlight[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.pricingFlightsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.pricingFlightsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.pricingFlightsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdatePricingFlightRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdatePricingFlightRequestDto,
      PricingFlight,
    );

    const [result] = await Promise.all([
      this.pricingFlightsRepository.update(entity),
      this.cacheManager.reset(),
    ]);

    return result;
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.pricingFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchAllByIataCode() {
    this.loggerService.log('fetchAllByIataCode...');

    const pricings = await this.pricingFlightsRepository.fetchAll();

    const mappedPricings = pricings.map<{
      fixedAmount: number;
      percentage: number;
      cabinClass: CabinClass;
      iataCode: string;
    }>((pricings) => {
      const iataCode = pricings.iataCode.iataCode;
      delete pricings.createdAt;
      delete pricings.updatedAt;
      delete pricings.id;
      return { ...pricings, iataCode };
    });

    return _.mapValues(_.groupBy(mappedPricings, 'iataCode'), (clist) =>
      clist.map((car) => _.omit(car, 'iataCode')),
    );
  }

  async fetchAllSortByCabinClassSortByIataCode() {
    this.loggerService.log('fetchAllSortByCabinClassSortByIataCode...');

    const pricings = await this.pricingFlightsRepository.fetchAll();

    const mappedPricings = pricings.map<{
      fixedAmount: number;
      percentage: number;
      cabinClass: CabinClass;
      iataCode: string;
      priceMargin: PriceMargin;
      id: number;
    }>((pricing) => {
      const iataCode = pricing.iataCode.iataCode;
      delete pricing.createdAt;
      delete pricing.updatedAt;
      return { ...pricing, iataCode };
    });

    const sortedByCabinClassObj = _.mapValues(
      _.groupBy(mappedPricings, 'cabinClass'),
      (clist) => clist.map((car) => _.omit(car, 'cabinClass')),
    );

    const result: {
      [x: string]: {
        [y: string]: Pick<
          Pick<
            {
              fixedAmount: number;
              percentage: number;
              cabinClass: CabinClass;
              iataCode: string;
              priceMargin: PriceMargin;
              id: number;
            },
            'iataCode' | 'fixedAmount' | 'percentage' | 'priceMargin' | 'id'
          >,
          'fixedAmount' | 'percentage' | 'priceMargin' | 'id'
        >;
      };
    } = {};

    for (const key in sortedByCabinClassObj) {
      if (Object.prototype.hasOwnProperty.call(sortedByCabinClassObj, key)) {
        result[key] = _.mapValues(
          _.groupBy(sortedByCabinClassObj[key], 'iataCode'),
          (clist) => clist.map((car) => _.omit(car, 'iataCode'))[0],
        );
      }
    }
    return result;
  }

  private async determinePricingForCabinClassForIataCodeExists(
    iataCode: IataCode,
    cabinClass: CabinClass,
  ) {
    const [entities, iataCodeDB] = await Promise.all([
      this.pricingFlightsRepository.fetchByIataCode(iataCode),
      this.iataCodesService.fetchById(iataCode.id),
    ]);

    const doesCabinClassExist = entities.some(
      (entity) => entity.cabinClass === cabinClass,
    );

    if (doesCabinClassExist)
      this.errorHandlerService.badRequestException(
        `Pricing for cabinClass:${cabinClass} iataCode:${iataCodeDB.iataCode} already exists`,
      );
  }
}

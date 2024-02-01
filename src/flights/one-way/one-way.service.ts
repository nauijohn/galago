import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { AnalyticsSearchFlightsService } from '../../analytics/analytics-searches/analytics-search-flights/analytics-search-flights.service';
import { FlightType } from '../../common/enums/flight-type.enum';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { Providers } from '../../credentials/providers.enum';
import { CabinClass } from '../../pricings/flights/cabin-class.enum';
import { PriceMargin } from '../../pricings/flights/price-margin.enum';
import { PricingFlightsService } from '../../pricings/flights/pricing-flights.service';
import { AggregatesService } from '../../providers/aggregates/aggregates.service';
import { MystiflyFareRulesRequestDto } from '../../providers/mystifly/flight-utils/dtos/request/mystifly-fare-rules-request.dto';
import { MystiflyFlightUtilsService } from '../../providers/mystifly/flight-utils/mystifly-flight-utils.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { FlightsUtil } from '../flights.util';
import { OneWayBookFlightsRequestDto } from './dtos/request/one-way-book-flights-request.dto';
import { OneWayPreBookFlightsRequestDto } from './dtos/request/one-way-pre-book-flights-request.dto';
import { OneWaySearchFlightsRequestDto } from './dtos/request/one-way-search-flights-request.dto';
import { MystiflyData } from './dtos/response/one-way-search-flights-response.dto';

type PricingsType = {
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
};

@Injectable()
export class OneWayService extends FlightsUtil {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly configService: ConfigService,
    private readonly aggregatesService: AggregatesService,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightUtilsService: MystiflyFlightUtilsService,
    private readonly pricingFlightsService: PricingFlightsService,
    private readonly analyticsSearchFlightsService: AnalyticsSearchFlightsService,
  ) {
    super(aggregatesService, configService, mystiflyFlightUtilsService);
  }

  async search(
    requestDto: OneWaySearchFlightsRequestDto,
    isWithTotalMarkUp?: boolean,
  ) {
    this.loggerService.log('search...');

    const { cacheName, cachedData } = await this.determineCache(
      FlightType.OneWay,
      requestDto,
      isWithTotalMarkUp,
    );
    if (cachedData) return cachedData;

    const pricings = await this.determinePricingsCache();

    const { mystiflyData, conversationId } = await this.mystiflySearchOneWay(
      requestDto,
      pricings,
      isWithTotalMarkUp,
    );

    const result = {
      mystifly: { ConversationId: conversationId, Data: mystiflyData },
    };

    // await this.analyticsAndSetCache(cacheName, result, isWithTotalMarkUp);

    if (!isWithTotalMarkUp) {
      if (this.ANALYTICS_FLIGHTS_SEARCH)
        await Promise.all([
          this.analyticsSearchFlightsService.create({
            ...result.mystifly.Data,
            provider: Providers.Mystifly,
            flightType: FlightType.OneWay,
          }),
          this.cacheManager.set(cacheName, result),
        ]);
      else await this.cacheManager.set(cacheName, result);
    }

    return result;
  }

  async preBook(requestDto: OneWayPreBookFlightsRequestDto) {
    this.loggerService.log('preBook...');

    const { conversationId, fareSourceCode } = requestDto;

    const fareRulesRequestDto: MystiflyFareRulesRequestDto = {
      FareSourceCode: fareSourceCode,
      ConversationId: conversationId,
    };

    const [fareRulesResult, revalidationResult, pricings] = await Promise.all([
      this.mystiflyFlightUtilsService.fareRules(fareRulesRequestDto),
      this.mystiflyFlightUtilsService.revalidation(fareRulesRequestDto),
      this.determinePricingsCache(),
    ]);
    if (!fareRulesResult.Success)
      this.errorHandlerService.internalServerErrorException(
        fareRulesResult.Message,
      );
    if (!revalidationResult.Success)
      this.errorHandlerService.internalServerErrorException(
        revalidationResult.Data.Errors,
      );

    return {
      fareRules: fareRulesResult.Data,
      revalidation: this.setMystiflyRevalidationPricing(
        revalidationResult,
        pricings,
      ).Data,
    };
  }

  async book(requestDto: OneWayBookFlightsRequestDto) {
    this.loggerService.log('book...');

    const mystiflyBookResult = await this.mystiflyFlightUtilsService.book(
      requestDto,
    );

    if (!mystiflyBookResult.Success)
      this.errorHandlerService.internalServerErrorException(mystiflyBookResult);

    return mystiflyBookResult.Data;
  }

  private async determinePricingsCache() {
    let pricings: PricingsType = {};
    const pricingsCache: PricingsType =
      await this.cacheManager.get<PricingsType>('flight_pricings');
    if (pricingsCache) {
      pricings = pricingsCache;
    } else {
      pricings =
        await this.pricingFlightsService.fetchAllSortByCabinClassSortByIataCode();
      await this.cacheManager.set('flight_pricings', pricings);
    }

    return pricings;
  }

  private parseXCacheKey() {
    const xCacheKey = this.request.headers['x-cache-key']
      ?.toString()
      .toLowerCase();
    return xCacheKey === 'true' ? true : xCacheKey === 'false' ? false : true;
  }

  private async determineCache(
    flightType: FlightType,
    requestDto: OneWaySearchFlightsRequestDto,
    isWithTotalMarkUp?: boolean,
  ) {
    const { departureDate, destinationCode, originCode, passengers } =
      requestDto;
    const { adults, children, infants } = passengers;
    const xCacheKey = this.parseXCacheKey();

    let cacheName = '';
    if (requestDto instanceof OneWaySearchFlightsRequestDto) {
      cacheName =
        `flights_${flightType}_${departureDate}_${originCode}_${destinationCode}_${adults}_${
          children ?? 0
        }_${infants ?? 0}`.replaceAll('/', '_');
    }

    let cachedData: MystiflyData;
    if (!isWithTotalMarkUp) {
      if (xCacheKey) {
        this.loggerService.log('get cache...');
        cachedData = await this.cacheManager.get<MystiflyData>(cacheName);
        if (cachedData) cachedData.mystifly.ConversationId = `${uuidv4()}`;
      }
    }

    return { cacheName, cachedData };
  }

  private async analyticsAndSetCache(
    cacheName: string,
    result: any,
    isWithTotalMarkUp?: boolean,
  ) {
    if (!isWithTotalMarkUp) {
      if (this.ANALYTICS_FLIGHTS_SEARCH) {
        // for (const key in result) {
        //   console.log('key: ', key);
        //   if (Object.prototype.hasOwnProperty.call(result, key)) {
        //     const element = result[key];
        //   }
        // }

        const resultKeys = Object.keys(result);
        // resultKeys.map((key) =>
        //   this.analyticsSearchFlightsService.create({
        //     ...result[key].Data,
        //     provider: Providers[key],
        //     flightType: FlightType.OneWay,
        //   }),
        // );
        const x = Providers['mystifly'];
        console.log('x: ', x);
        console.log('resultKeys: ', resultKeys);
        await this.cacheManager.set(cacheName, result);
        // await Promise.all([
        //   this.analyticsSearchFlightsService.create({
        //     ...result.mystifly.Data,
        //     provider: Providers.Mystifly,
        //     flightType: FlightType.OneWay,
        //   }),
        //   this.cacheManager.set(cacheName, result),
        // ]);
      } else await this.cacheManager.set(cacheName, result);
    }
  }
}

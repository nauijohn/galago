import { Cache } from 'cache-manager';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { PricingHotelsService } from '../pricings/hotels/pricing-hotels.service';
import { AggregatesService } from '../providers/aggregates/aggregates.service';
import {
  TboBookRequestDto,
  TboCustomerName,
} from '../providers/tbo/hotel-utils/hotels/dtos/request/tbo-book-request.dto';
import {
  TboPaxRooms,
  TboSearchHotelsRequestDto,
} from '../providers/tbo/hotel-utils/hotels/dtos/request/tbo-search-hotels-request.dto';
import { TboHotelDetails } from '../providers/tbo/hotel-utils/hotels/dtos/response/tbo-hotel-details-response.dto';
import {
  TboHotelResult,
  TboRooms,
  TboSearchHotelsResponseDto,
} from '../providers/tbo/hotel-utils/hotels/dtos/response/tbo-search-hotels-response.dto';
import { TboHotelsService } from '../providers/tbo/hotel-utils/hotels/tbo-hotels.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import {
  BookHotelsCustomerName,
  BookHotelsRequestDto,
} from './dtos/request/book-hotels-request.dto';
import { PreBookHotelsRequestDto } from './dtos/request/prebook-hotels-request.dto';
import { SearchHotelsRequestDto } from './dtos/request/search-hotels-request.dto';
import { PriceMargin } from './price-margin.enum';

type HotelPricings = {
  [x: string]: {
    fixedAmount: number;
    percentage: number;
    priceMargin: string;
  };
};

@Injectable()
export class HotelsService {
  private readonly DEFAULT_RESPONSE_TIME = 10;
  private readonly DEFAULT_CHILDREN_AGE = 12;
  private readonly DEFAULT_GUEST_NATIONALITY = 'PH';
  private readonly DEFAULT_IS_DETAILED_RESPONSE = true;
  private readonly DEFAULT_FILTERS_REFUNDABLE = null;
  private readonly DEFAULT_NO_OF_ROOMS = null;
  private readonly DEFAULT_MEAL_TYPE = null;

  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly tboHotelsService: TboHotelsService,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly aggregatesService: AggregatesService,
    private readonly pricingHotelsService: PricingHotelsService,
  ) {}

  async search(
    requestDto: SearchHotelsRequestDto,
    isWithTotalMarkUp?: boolean,
  ) {
    this.loggerService.log('search...');

    const { cacheName, cachedData } = await this.determineCache(
      requestDto,
      isWithTotalMarkUp,
    );
    if (cachedData) return cachedData;

    const pricings = await this.determinePricingsCache();

    const response = {
      tbo: await this.parseTboResults(requestDto, pricings, isWithTotalMarkUp),
    };

    if (response.tbo.length !== 0)
      await this.cacheManager.set(cacheName, response);

    return response;
  }

  async preBook(preBookHotelsRequestDto: PreBookHotelsRequestDto) {
    this.loggerService.log('preBook...');

    const { bookingCodes } = preBookHotelsRequestDto;

    const tobHotelsPrebookResponses = await Promise.all(
      bookingCodes.map((bookingCode) =>
        this.tboHotelsService.preBook({
          BookingCode: bookingCode,
          paymentMode: 'Limit',
        }),
      ),
    );
    const tboPreBookingResults = tobHotelsPrebookResponses.map(
      (tobHotelsPrebookResponse) =>
        tobHotelsPrebookResponse.HotelResult
          ? tobHotelsPrebookResponse.HotelResult[0]
          : tobHotelsPrebookResponse.Status.Description,
    );

    return {
      tbo: tboPreBookingResults,
    };
  }

  async book(bookHotelsRequestDto: BookHotelsRequestDto) {
    this.loggerService.log('book...');

    const { customerNames } = bookHotelsRequestDto;

    const tboBookRequestDto = this.classMapper.map(
      bookHotelsRequestDto,
      BookHotelsRequestDto,
      TboBookRequestDto,
    );
    tboBookRequestDto.CustomerDetails = [
      {
        CustomerNames: this.classMapper.mapArray(
          customerNames,
          BookHotelsCustomerName,
          TboCustomerName,
        ),
      },
    ];

    console.log(
      'tboBookRequestDto: ',
      JSON.stringify(tboBookRequestDto, null, 2),
    );

    const tboHotelBookResponse = await this.tboHotelsService.book(
      tboBookRequestDto,
    );

    console.log('tboHotelBookResponse: ', tboHotelBookResponse);

    if (tboHotelBookResponse.Status.Code !== 200)
      this.errorHandlerService.internalServerErrorException(
        tboHotelBookResponse.Status.Description,
      );

    return tboHotelBookResponse;
  }

  private populatePaxRooms({ rooms, adults, children }): TboPaxRooms[] {
    if (!adults)
      this.errorHandlerService.badRequestException('Must have an adult');

    if (rooms > adults)
      this.errorHandlerService.badRequestException(
        'Rooms cannot be greater than adults',
      );

    const paxRooms: TboPaxRooms[] = [];
    if (rooms === adults) {
      for (let count = 1; count <= rooms; count++) {
        const room: TboPaxRooms = {
          Adults: 1,
          Children: 0,
          ChildrenAges: [],
        };
        paxRooms.push(room);
      }
    }

    if (rooms !== adults) {
      for (let count = 1; count <= rooms; count++) {
        const room: TboPaxRooms = {
          Adults: 0,
          Children: 0,
          ChildrenAges: [],
        };
        paxRooms.push(room);
      }
      let adultsCount = adults;
      while (adultsCount) {
        paxRooms.forEach((paxRoom) => {
          if (!adultsCount) return;
          paxRoom.Adults++;
          adultsCount--;
        });
      }
    }

    if (children) {
      let childrenCount = children;
      while (childrenCount) {
        paxRooms.forEach((paxRoom) => {
          if (!childrenCount) return;
          paxRoom.Children++;
          paxRoom.ChildrenAges.push(this.DEFAULT_CHILDREN_AGE);
          childrenCount--;
        });
      }
    }

    return paxRooms;
  }

  private async fetchAllHotelCodesWithAutoSearch(keyword: string) {
    this.loggerService.log('fetchAllHotelCodesWithAutoSearch...');
    const { tag: hotels } = await this.aggregatesService.tboHotelAutoSearch({
      keyword,
      page: '1',
      pagination: '1344',
    });

    return hotels.length !== 0
      ? hotels.map((hotel) => hotel.HotelCode).join(',')
      : '';
  }

  private async parseTboResultsOld(
    searchHotelsRequestDto: SearchHotelsRequestDto,
  ) {
    const { checkInDate, checkOutDate, location, rooms, adults, children } =
      searchHotelsRequestDto;
    const hotelCodes = await this.fetchAllHotelCodesWithAutoSearch(location);
    const tboSearchRequestDto: TboSearchHotelsRequestDto = {
      CheckIn: checkInDate,
      CheckOut: checkOutDate,
      HotelCodes: hotelCodes,
      PaxRooms: this.populatePaxRooms({ rooms, children, adults }),
      GuestNationality: this.DEFAULT_GUEST_NATIONALITY,
      ResponseTime: this.DEFAULT_RESPONSE_TIME,
      IsDetailedResponse: this.DEFAULT_IS_DETAILED_RESPONSE,
      Filters: {
        Refundable: this.DEFAULT_FILTERS_REFUNDABLE,
        NoOfRooms: this.DEFAULT_NO_OF_ROOMS,
        MealType: this.DEFAULT_MEAL_TYPE,
      },
    };
    const { HotelResult: tbo } = await this.tboHotelsService.search(
      tboSearchRequestDto,
    );
    const result: TboHotelResult[] & TboHotelDetails[] = [];
    if (tbo) {
      const hotelCodesArr = tbo.map((data) => data.HotelCode);
      const hotelDetailsResult = await Promise.all(
        hotelCodesArr.map((hotelCodes) =>
          this.tboHotelsService.fetchHotelDetails(hotelCodes),
        ),
      );
      const hotelDetails: TboHotelDetails[] = [];
      hotelDetailsResult.forEach((hotelDetail) => {
        hotelDetails.push(...hotelDetail.HotelDetails);
      });
      tbo.forEach((tboHotelResult) => {
        const hotelDetail = hotelDetails.find((hotelDetail) => {
          if (hotelDetail.HotelCode === tboHotelResult.HotelCode)
            return hotelDetail;
        });
        result.push({ ...tboHotelResult, ...hotelDetail });
      });
    }
    return result;
  }

  private async parseTboResults(
    searchHotelsRequestDto: SearchHotelsRequestDto,
    pricings: HotelPricings,
    isWithTotalMarkUp?: boolean,
  ) {
    const { tboSearchRequestDtos, paxRooms } =
      await this.constructTboSearchRequestDto(searchHotelsRequestDto);
    const hotelQueryResults = await this.searchTboHotels(tboSearchRequestDtos);
    const hotelResults = this.separateSearchPerPaxRoom(
      hotelQueryResults,
      paxRooms,
    );
    const newHotelResult = this.combineRoomsPerPax(hotelResults);
    const result = await this.appendHotelDetails(newHotelResult);

    if (result.length !== 0)
      return this.setTboPricing(result, pricings, isWithTotalMarkUp);
    return result;
  }

  private async determinePricingsCache() {
    let pricings: HotelPricings = {};
    const pricingsCache = await this.cacheManager.get<HotelPricings>(
      'hotel_pricings',
    );
    if (pricingsCache) return pricingsCache;
    else {
      pricings = await this.pricingHotelsService.fetchAllSortedByRating();
      await this.cacheManager.set('hotel_pricings', pricings);
    }
    return pricings;
  }

  private setTboPricing(
    tboData: TboHotelResult[] & TboHotelDetails[],
    pricings: HotelPricings,
    isWithTotalMarkUp?: boolean,
  ) {
    const hotelRating = tboData[0].HotelRating?.toString();
    const pricingToBeUsed = pricings[hotelRating];
    const { priceMargin, fixedAmount, percentage } = pricingToBeUsed;

    const tboRoomsWithPricing = tboData[0].Rooms.map<
      TboRooms & { TotalFareWithMarkUp?: number }
    >((tboRoom) => {
      tboRoom.DayRates[0] = tboRoom.DayRates[0].map((dayRate) => {
        let TotalFareWithMarkUpFloat = dayRate.BasePrice;
        switch (priceMargin) {
          case PriceMargin.Fixed:
            TotalFareWithMarkUpFloat = TotalFareWithMarkUpFloat + fixedAmount;
            break;
          case PriceMargin.Percentage:
            TotalFareWithMarkUpFloat =
              TotalFareWithMarkUpFloat + TotalFareWithMarkUpFloat * percentage;
            break;
          case PriceMargin.Both:
            TotalFareWithMarkUpFloat =
              (TotalFareWithMarkUpFloat + fixedAmount) * percentage +
              (TotalFareWithMarkUpFloat + fixedAmount);
            break;
          default:
            TotalFareWithMarkUpFloat = TotalFareWithMarkUpFloat;
            break;
        }
        if (isWithTotalMarkUp) {
          dayRate.BasePriceWithMarkUpFloat = TotalFareWithMarkUpFloat;
          return dayRate;
        }
        dayRate.BasePrice = TotalFareWithMarkUpFloat;
        return dayRate;
      });

      if (isWithTotalMarkUp) {
        return {
          ...tboRoom,
          TotalFareWithMarkUp:
            tboRoom.DayRates[0].reduce(
              (a, b) => a + Number(b.BasePriceWithMarkUpFloat),
              0,
            ) + tboRoom.TotalTax,
        };
      }
      tboRoom.TotalFare =
        tboRoom.DayRates[0].reduce((a, b) => a + Number(b.BasePrice), 0) +
        tboRoom.TotalTax;

      return { ...tboRoom };
    });
    tboData[0].Rooms = tboRoomsWithPricing;
    return tboData;
  }

  async constructTboSearchRequestDto(
    searchHotelsRequestDto: SearchHotelsRequestDto,
  ) {
    const { checkInDate, checkOutDate, location, rooms, adults, children } =
      searchHotelsRequestDto;
    const hotelCodes = await this.fetchAllHotelCodesWithAutoSearch(location);
    const paxRooms = this.populatePaxRooms({ rooms, children, adults });
    const tboSearchHotelsRequestDtos = paxRooms.map((paxRoom) => ({
      CheckIn: checkInDate,
      CheckOut: checkOutDate,
      HotelCodes: hotelCodes,
      PaxRooms: [paxRoom],
      GuestNationality: this.DEFAULT_GUEST_NATIONALITY,
      ResponseTime: this.DEFAULT_RESPONSE_TIME,
      IsDetailedResponse: this.DEFAULT_IS_DETAILED_RESPONSE,
      Filters: {
        Refundable: this.DEFAULT_FILTERS_REFUNDABLE,
        NoOfRooms: this.DEFAULT_NO_OF_ROOMS,
        MealType: this.DEFAULT_MEAL_TYPE,
      },
    }));

    return { tboSearchRequestDtos: tboSearchHotelsRequestDtos, paxRooms };
  }

  async searchTboHotels(tboSearchRequestDtos: TboSearchHotelsRequestDto[]) {
    return await Promise.all(
      tboSearchRequestDtos.map((tboSearchRequestDto) =>
        this.tboHotelsService.search(tboSearchRequestDto),
      ),
    );
  }

  separateSearchPerPaxRoom(
    hotelQueryResults: TboSearchHotelsResponseDto[],
    paxRooms: TboPaxRooms[],
  ) {
    return hotelQueryResults.map(({ HotelResult }, index) => {
      if (!HotelResult || HotelResult.length === 0) return [];
      HotelResult[0].Rooms = HotelResult[0].Rooms.map((room) => {
        room.Adults = paxRooms[index].Adults;
        room.Children = paxRooms[index].Children;
        return room;
      });
      return HotelResult;
    });
  }

  combineRoomsPerPax(hotelResults: TboHotelResult[][]) {
    const newHotelResult: TboHotelResult[] = [];
    hotelResults.forEach((hotelResult) => {
      if (hotelResult.length === 0) return;
      hotelResult.forEach((hotelRes) => {
        if (!hotelRes || Object.keys(hotelRes).length === 0) return;
        const doesExists = newHotelResult.some(
          (x) => x.HotelCode === hotelRes.HotelCode,
        );
        if (!doesExists) newHotelResult.push(hotelRes);
        else {
          const index = newHotelResult.findIndex(
            (x) => x.HotelCode === hotelRes.HotelCode,
          );
          newHotelResult[index].Rooms.push(...hotelRes.Rooms);
        }
      });
    });
    return newHotelResult;
  }

  async appendHotelDetails(newHotelResult: TboHotelResult[]) {
    const result: TboHotelResult[] & TboHotelDetails[] = [];
    if (newHotelResult) {
      const hotelCodesArr = newHotelResult.map((data) => data.HotelCode);
      const hotelDetailsResult = await Promise.all(
        hotelCodesArr.map((hotelCodes) =>
          this.tboHotelsService.fetchHotelDetails(hotelCodes),
        ),
      );
      const hotelDetails: TboHotelDetails[] = [];
      hotelDetailsResult.forEach((hotelDetail) => {
        hotelDetails.push(...hotelDetail.HotelDetails);
      });
      newHotelResult.forEach((tboHotelResult) => {
        const hotelDetail = hotelDetails.find((hotelDetail) => {
          if (hotelDetail.HotelCode === tboHotelResult.HotelCode)
            return hotelDetail;
        });
        result.push({ ...tboHotelResult, ...hotelDetail });
      });
    }
    return result;
  }

  private async determineCache(
    requestDto: SearchHotelsRequestDto,
    isWithTotalMarkUp?: boolean,
  ) {
    const { checkInDate, checkOutDate, location, rooms, adults, children } =
      requestDto;
    const xCacheKey = this.parseXCacheKey();
    let cacheName = '';
    if (requestDto instanceof SearchHotelsRequestDto) {
      cacheName =
        `hotels_${checkInDate}_${checkOutDate}_${location}_${rooms}_${adults}_${
          children ?? 0
        }`.replaceAll('/', '_');
    }
    let cachedData: any;
    if (!isWithTotalMarkUp) {
      if (xCacheKey) {
        this.loggerService.log('get cache...');
        cachedData = await this.cacheManager.get(cacheName);
      }
    }

    return { cacheName, cachedData };
  }

  private parseXCacheKey() {
    const xCacheKey = this.request.headers['x-cache-key']
      ?.toString()
      .toLowerCase();
    return xCacheKey === 'true' ? true : xCacheKey === 'false' ? false : true;
  }
}

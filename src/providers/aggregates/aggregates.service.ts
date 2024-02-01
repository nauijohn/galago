import * as lodash from 'lodash';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { MyLoggerService } from '../../utils/my-logger.service';
import { AirlineListsService } from '../galago-utilities/airline-lists/airline-lists.service';
import { AirportListsService } from '../galago-utilities/airport-lists/airport-lists.service';
import { HotelListsService } from '../galago-utilities/hotel-lists/hotel-lists.service';
import { AirlineAutoSearchRequestDto } from './dtos/request/airline-auto-search-request.dto';
import { AirportAutoSearchRequestDto } from './dtos/request/airport-auto-search-request.dto';
import { TboHotelAutoSearchRequestDto } from './dtos/request/tbo-hotel-auto-search-request.dto';
import { AirportAutoSearchGroupedData } from './dtos/response/airport-auto-search-grouped-response.dto';

@Injectable()
export class AggregatesService {
  private readonly config = {
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/json',
    },
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly loggerService: MyLoggerService,
    private readonly airlineListsService: AirlineListsService,
    private readonly airportListsService: AirportListsService,
    private readonly hotelListsService: HotelListsService,
  ) {}

  async tboHotelAutoSearch(
    tboHotelAutoSearchRequestDto: TboHotelAutoSearchRequestDto,
  ) {
    this.loggerService.log('tboHotelAutoSearch...');
    const { keyword, page, pagination } = tboHotelAutoSearchRequestDto;
    return await this.hotelListsService.fetchAll({
      hotelSearch: keyword,
      page: +page,
      pagination: +pagination,
    });
    // let url = `https://util.galago.com.ph/api/get/hotel-code-autofill?hotelSearch=${keyword}`;
    // if (page) url += `&page=${page}`;
    // if (pagination) url += `&pagination=${pagination}`;
    // const { data } = await lastValueFrom(
    //   this.httpService.get(url, this.config).pipe(
    //     catchError((error: AxiosError) => {
    //       this.loggerService.error('error', error.response.data);
    //       throw error;
    //     }),
    //   ),
    // );
    // return data;
  }

  async airportAutoSearch(
    airportAutoSearchRequestDto: AirportAutoSearchRequestDto,
  ) {
    this.loggerService.log('airportAutoSearch...');
    const { keyword, page, pagination } = airportAutoSearchRequestDto;
    return await this.airportListsService.fetchAll({
      airportSearch: keyword,
      page: +page,
      pagination: +pagination,
    });
    // let url = `https://util.galago.com.ph/api/get/airport-code-autofill?airportSearch=${keyword}`;
    // if (page) url += `&page=${page}`;
    // if (pagination) url += `&pagination=${pagination}`;
    // const { data } = await lastValueFrom(
    //   this.httpService.get<AirportAutoSearchResponseDto>(url, this.config).pipe(
    //     catchError((error: AxiosError) => {
    //       this.loggerService.error('error', error.response.data);
    //       throw error;
    //     }),
    //   ),
    // );
    // return data;
  }

  async airlineAutoSearch(
    airlineAutoSearchRequestDto: AirlineAutoSearchRequestDto,
  ) {
    this.loggerService.log('airportAutoSearch...');
    const { keyword, page, pagination } = airlineAutoSearchRequestDto;

    return await this.airlineListsService.fetchAll({
      code: keyword,
      page: +page,
      pagination: +pagination,
    });
    // let url = `https://util.galago.com.ph/api/get/airline-code-autofill?airlineSearch=${keyword}`;
    // if (page) url += `&page=${page}`;
    // if (pagination) url += `&pagination=${pagination}`;
    // const { data } = await lastValueFrom(
    //   this.httpService.get<AirlineAutoSearchResponseDto>(url, this.config).pipe(
    //     catchError((error: AxiosError) => {
    //       this.loggerService.error('error', error.response.data);
    //       throw error;
    //     }),
    //   ),
    // );
    // return data;
  }

  async airportAutoSearchGrouped(
    airportAutoSearchRequestDto: AirportAutoSearchRequestDto,
  ) {
    airportAutoSearchRequestDto.pagination = '999';
    const data = await this.airportAutoSearch(airportAutoSearchRequestDto);
    const result: AirportAutoSearchGroupedData[] = [];
    const groupedByCityName = lodash.groupBy(data.tag, 'cityCode');
    for (const key in groupedByCityName) {
      if (Object.prototype.hasOwnProperty.call(groupedByCityName, key)) {
        const element = groupedByCityName[key];
        result.push({
          cityCode: key,
          cityName: element[0].cityName,
          airports: element.map((el) => {
            return { airportName: el.airportName, airportCode: el.airportCode };
          }),
        });
      }
    }
    return result;
  }
}

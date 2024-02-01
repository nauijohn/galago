import { Model } from 'mongoose';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MyLoggerService } from '../../../utils/my-logger.service';
import { AirportList } from './airport-list.schema';
import { AirportListDto } from './dtos/airport-list.dto';
import { FetchAllAirportListQueryDto } from './dtos/fetch-all-airport-list-query.dto';

@Injectable()
export class AirportListsRepository {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectModel(AirportList.name)
    private readonly airportListModel: Model<AirportList>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async fetchAll(queries: FetchAllAirportListQueryDto) {
    this.loggerService.log('fetchAll...');

    const {
      page,
      pagination,
      airportSearch,
      airportCode,
      airportName,
      cityCode,
      cityName,
      countryCode,
      countryName,
    } = queries;

    let keyword = '';

    if (airportSearch) keyword = airportSearch;
    if (airportCode) keyword = airportCode;
    if (airportName) keyword = airportName;
    if (cityCode) keyword = cityCode;
    if (cityName) keyword = cityName;
    if (countryCode) keyword = countryCode;
    if (countryName) keyword = countryName;

    const document = await this.airportListModel
      .find({
        $or: [
          { airportName: { $regex: keyword, $options: 'i' } },
          { cityName: { $regex: keyword, $options: 'i' } },
          { cityCode: { $regex: keyword, $options: 'i' } },
          { airportCode: { $regex: keyword, $options: 'i' } },
          { countryCode: { $regex: keyword, $options: 'i' } },
          { countryName: { $regex: keyword, $options: 'i' } },
        ],
      })
      .skip((page - 1) * pagination)
      .limit(pagination);

    return this.classMapper.mapArray(document, AirportList, AirportListDto);
  }

  async count() {
    return await this.airportListModel.find().count();
  }
}

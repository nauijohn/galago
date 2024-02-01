import { Model } from 'mongoose';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MyLoggerService } from '../../../utils/my-logger.service';
import { FetchAllHotelListQueryDto } from './dtos/fetch-all-hotel-list-query.dto';
import { HotelListDto } from './dtos/hotel-list.dto';
import { HotelList } from './hotel-list.schema';

@Injectable()
export class HotelListsRepository {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectModel(HotelList.name)
    private readonly hotelListModel: Model<HotelList>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async fetchAll(queries: FetchAllHotelListQueryDto) {
    this.loggerService.log('fetchAll...');

    const { page, pagination, cityCode, cityName, hotelSearch } = queries;

    let keyword = '';

    if (hotelSearch) keyword = hotelSearch;
    if (cityCode) keyword = cityCode;
    if (cityName) keyword = cityName;

    const document = await this.hotelListModel
      .find({
        $or: [
          { HotelName: { $regex: keyword, $options: 'i' } },
          { HotelRating: { $regex: keyword, $options: 'i' } },
          { CityName: { $regex: keyword, $options: 'i' } },
          { CountryName: { $regex: keyword, $options: 'i' } },
          { HotelCode: { $regex: keyword, $options: 'i' } },
        ],
      })
      .skip((page - 1) * pagination)
      .limit(pagination);

    return this.classMapper.mapArray(document, HotelList, HotelListDto);
  }

  async count() {
    return await this.hotelListModel.find().count();
  }
}

import { Model } from 'mongoose';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MyLoggerService } from '../../../utils/my-logger.service';
import { AirlineList } from './airline-list.schema';
import { AirlineListDto } from './dtos/airline-list.dto';
import { FetchAllAirlineListQueryDto } from './dtos/fetch-all-airline-list-query.dto';

@Injectable()
export class AirlineListsRepository {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectModel(AirlineList.name)
    private readonly airlineListModel: Model<AirlineList>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async fetchAll(queries: FetchAllAirlineListQueryDto) {
    this.loggerService.log('fetchAll...');

    const { code, page, pagination } = queries;

    let keyword = '';

    if (code) keyword = code;

    const document = await this.airlineListModel
      .find({
        $or: [{ code: { $regex: keyword, $options: 'i' } }],
      })
      .skip((page - 1) * pagination)
      .limit(pagination);

    return this.classMapper.mapArray(document, AirlineList, AirlineListDto);
  }

  async count() {
    return await this.airlineListModel.find().count();
  }
}

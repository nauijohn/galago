import { Injectable } from '@nestjs/common';

import { FetchAllHotelListQueryDto } from './dtos/fetch-all-hotel-list-query.dto';
import { HotelListsRepository } from './hotel-lists.repository';

@Injectable()
export class HotelListsService {
  constructor(private readonly hotelListsRepository: HotelListsRepository) {}

  async fetchAll(queries: FetchAllHotelListQueryDto) {
    const { page, pagination } = queries;

    const [tag, total] = await Promise.all([
      this.hotelListsRepository.fetchAll(queries),
      this.hotelListsRepository.count(),
    ]);

    return {
      identifier: 'get all airport list',
      tag,
      total,
      page,
      pagination,
    };
  }
}

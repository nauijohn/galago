import { Injectable } from '@nestjs/common';

import { AirportListsRepository } from './airport-lists.repository';
import { FetchAllAirportListQueryDto } from './dtos/fetch-all-airport-list-query.dto';

@Injectable()
export class AirportListsService {
  constructor(
    private readonly airportListsRepository: AirportListsRepository,
  ) {}

  async fetchAll(queries: FetchAllAirportListQueryDto) {
    const { page, pagination } = queries;

    const [tag, total] = await Promise.all([
      this.airportListsRepository.fetchAll(queries),
      this.airportListsRepository.count(),
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

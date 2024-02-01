import { Injectable } from '@nestjs/common';

import { AirlineListsRepository } from './airline-lists.repository';
import { FetchAllAirlineListQueryDto } from './dtos/fetch-all-airline-list-query.dto';

@Injectable()
export class AirlineListsService {
  constructor(
    private readonly airlineListsRepository: AirlineListsRepository,
  ) {}

  async fetchAll(queries: FetchAllAirlineListQueryDto) {
    const { page, pagination } = queries;

    const [tag, total] = await Promise.all([
      this.airlineListsRepository.fetchAll(queries),
      this.airlineListsRepository.count(),
    ]);

    return {
      identifier: 'get all airline list',
      tag,
      total,
      page,
      pagination,
    };
  }
}

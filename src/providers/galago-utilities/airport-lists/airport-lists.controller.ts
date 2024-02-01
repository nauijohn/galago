import { Controller, Get, Query } from '@nestjs/common';

import { Public } from '../../../auth/decorators/is-public.decorator';
import { AirportListsService } from './airport-lists.service';
import { FetchAllAirportListQueryDto } from './dtos/fetch-all-airport-list-query.dto';

@Controller()
@Public()
export class AirportListsController {
  constructor(private readonly airportListsService: AirportListsService) {}

  @Get()
  async fetchAll(@Query() queries: FetchAllAirportListQueryDto) {
    return await this.airportListsService.fetchAll(queries);
  }
}

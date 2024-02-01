import { Controller, Get, Query } from '@nestjs/common';

import { Public } from '../../../auth/decorators/is-public.decorator';
import { AirlineListsService } from './airline-lists.service';
import { FetchAllAirlineListQueryDto } from './dtos/fetch-all-airline-list-query.dto';

@Controller()
@Public()
export class AirlineListsController {
  constructor(private readonly airlineListsService: AirlineListsService) {}

  @Get()
  async fetchAll(@Query() queries: FetchAllAirlineListQueryDto) {
    return await this.airlineListsService.fetchAll(queries);
  }
}

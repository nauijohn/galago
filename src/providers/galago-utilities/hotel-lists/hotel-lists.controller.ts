import { Controller, Get, Query } from '@nestjs/common';

import { Public } from '../../../auth/decorators/is-public.decorator';
import { FetchAllHotelListQueryDto } from './dtos/fetch-all-hotel-list-query.dto';
import { HotelListsService } from './hotel-lists.service';

@Controller()
@Public()
export class HotelListsController {
  constructor(private readonly hotelListsService: HotelListsService) {}

  @Get()
  async fetchAll(@Query() queries: FetchAllHotelListQueryDto) {
    return await this.hotelListsService.fetchAll(queries);
  }
}

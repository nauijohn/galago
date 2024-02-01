import { Module } from '@nestjs/common';

import { AirlineListsModule } from './airline-lists/airline-lists.module';
import { AirportListsModule } from './airport-lists/airport-lists.module';
import { HotelListsModule } from './hotel-lists/hotel-lists.module';

@Module({
  imports: [AirlineListsModule, AirportListsModule, HotelListsModule],
  exports: [AirlineListsModule, AirportListsModule, HotelListsModule],
})
export class GalagoUtilitiesModule {}

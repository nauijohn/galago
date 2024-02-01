import { Module } from '@nestjs/common';

import { TboHotelDetailsModule } from '../../providers/tbo/hotel-details/tbo-hotel-details.module';
import { UtilsModule } from '../../utils/utils.module';
import { BookingHotelProcessesGateway } from './booking-hotel-processes.gateway';
import { BookingHotelProcessesService } from './booking-hotel-processes.service';

@Module({
  imports: [UtilsModule, TboHotelDetailsModule],
  providers: [BookingHotelProcessesService, BookingHotelProcessesGateway],
  exports: [BookingHotelProcessesService],
})
export class BookingHotelProcessesModule {}

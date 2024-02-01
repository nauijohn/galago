import { Module } from '@nestjs/common';

import { MystiflyFlightDetailsModule } from '../../providers/mystifly/flight-details/mystifly-flight-details.module';
import { UtilsModule } from '../../utils/utils.module';
import { BookingFlightProcessesGateway } from './booking-flight-processes.gateway';
import { BookingFlightProcessesService } from './booking-flight-processes.service';

@Module({
  imports: [UtilsModule, MystiflyFlightDetailsModule],
  providers: [BookingFlightProcessesService, BookingFlightProcessesGateway],
  exports: [BookingFlightProcessesService],
})
export class BookingFlightProcessesModule {}

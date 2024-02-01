import { Module } from '@nestjs/common';

import { BookingFlightsModule } from '../../bookings/booking-flights/booking-flights.module';
import { BookingHotelsModule } from '../../bookings/booking-hotels/booking-hotels.module';
import { HotelsModule } from '../../hotels/hotels.module';
import { NestMailerModule } from '../../nest-mailer/nest-mailer.module';
import { MystiflyFlightBookResponsesModule } from '../../providers/mystifly/flight-book-responses/mystifly-flight-book-responses.module';
import { MystiflyFlightUtilsModule } from '../../providers/mystifly/flight-utils/mystifly-flight-utils.module';
import { TboHotelBookResponsesModule } from '../../providers/tbo/hotel-book-responses/tbo-hotel-book-responses.module';
import { UtilsModule } from '../../utils/utils.module';
import { PaymongoEventProcessesGateway } from './paymongo-event-processes.gateway';
import { PaymongoEventProcessesService } from './paymongo-event-processes.service';

@Module({
  imports: [
    UtilsModule,
    NestMailerModule,
    BookingFlightsModule,
    MystiflyFlightBookResponsesModule,
    MystiflyFlightUtilsModule,
    HotelsModule,
    TboHotelBookResponsesModule,
    BookingHotelsModule,
  ],
  providers: [PaymongoEventProcessesService, PaymongoEventProcessesGateway],
  exports: [PaymongoEventProcessesService],
})
export class PaymongoEventProcessesModule {}

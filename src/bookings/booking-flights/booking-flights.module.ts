import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerFlightDetailsModule } from '../../customer-details/flights/customer-flight-details.module';
import { PassengerDetailsModule } from '../../flights/passenger-details/passenger-details.module';
import { PaymentFlightsModule } from '../../payments/payment-flights/payment-flights.module';
import { TransactionFlightsModule } from '../../transactions/flights/transaction-flights.module';
import { UtilsModule } from '../../utils/utils.module';
import { BookingFlightProcessesModule } from '../booking-flight-processes/booking-flight-processes.module';
import { BookingFlightsMapperProfile } from './automapper/booking-flights-mapper.profile';
import { BookingFlight } from './booking-flight.entity';
import { BookingFlightsController } from './booking-flights.controller';
import { BookingFlightsRepository } from './booking-flights.repository';
import { BookingFlightsService } from './booking-flights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingFlight]),
    UtilsModule,
    PaymentFlightsModule,
    TransactionFlightsModule,
    CustomerFlightDetailsModule,
    PassengerDetailsModule,
    BookingFlightProcessesModule,
  ],
  controllers: [BookingFlightsController],
  providers: [
    BookingFlightsService,
    BookingFlightsRepository,
    BookingFlightsMapperProfile,
  ],
  exports: [BookingFlightsService],
})
export class BookingFlightsModule {}

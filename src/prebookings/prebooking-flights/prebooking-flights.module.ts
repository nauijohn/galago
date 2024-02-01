import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionFlightsModule } from '../../transactions/flights/transaction-flights.module';
import { UtilsModule } from '../../utils/utils.module';
import { PrebookingFlightProcessesModule } from '../prebooking-flight-processes/prebooking-flight-processes.module';
import { PrebookingFlightsMapperProfile } from './automapper/prebooking-flights-mapper.profile';
import { PrebookingFlight } from './prebooking-flight.entity';
import { PrebookingFlightsController } from './prebooking-flights.controller';
import { PrebookingFlightsRepository } from './prebooking-flights.repository';
import { PrebookingFlightsService } from './prebooking-flights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrebookingFlight]),
    UtilsModule,
    TransactionFlightsModule,
    PrebookingFlightProcessesModule,
  ],
  controllers: [PrebookingFlightsController],
  providers: [
    PrebookingFlightsService,
    PrebookingFlightsRepository,
    PrebookingFlightsMapperProfile,
  ],
  exports: [PrebookingFlightsService],
})
export class PrebookingFlightsModule {}

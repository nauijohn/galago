import { Module } from '@nestjs/common';

import { MystiflyFlightFareRulesResponsesModule } from '../../providers/mystifly/flight-fare-rules-responses/mystifly-flight-fare-rules-responses.module';
import { MystiflyFlightRevalidationResponsesModule } from '../../providers/mystifly/flight-revalidation-responses/mystifly-flight-revalidation-responses.module';
import { PrebookingFlightProcessGateway } from './prebooking-flight-processes.gateway';
import { PrebookingFlightProcessesService } from './prebooking-flight-processes.service';

@Module({
  imports: [
    MystiflyFlightFareRulesResponsesModule,
    MystiflyFlightRevalidationResponsesModule,
  ],
  providers: [PrebookingFlightProcessesService, PrebookingFlightProcessGateway],
  exports: [PrebookingFlightProcessesService],
})
export class PrebookingFlightProcessesModule {}

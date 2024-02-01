import { Module } from '@nestjs/common';

import { MystiflyFlightBookResponsesModule } from './flight-book-responses/mystifly-flight-book-responses.module';
import { MystiflyFlightDetailsModule } from './flight-details/mystifly-flight-details.module';
import { MystiflyFlightFareRulesResponsesModule } from './flight-fare-rules-responses/mystifly-flight-fare-rules-responses.module';
import { MystiflyFlightRevalidationResponsesModule } from './flight-revalidation-responses/mystifly-flight-revalidation-responses.module';
import { MystiflyFlightUtilsModule } from './flight-utils/mystifly-flight-utils.module';

@Module({
  imports: [
    MystiflyFlightDetailsModule,
    MystiflyFlightUtilsModule,
    MystiflyFlightFareRulesResponsesModule,
    MystiflyFlightRevalidationResponsesModule,
    MystiflyFlightBookResponsesModule,
  ],
  exports: [
    MystiflyFlightDetailsModule,
    MystiflyFlightUtilsModule,
    MystiflyFlightFareRulesResponsesModule,
    MystiflyFlightRevalidationResponsesModule,
    MystiflyFlightBookResponsesModule,
  ],
})
export class MystiflyModule {}

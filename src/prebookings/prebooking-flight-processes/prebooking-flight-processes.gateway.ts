import { Injectable } from '@nestjs/common';

import { FlightProvider } from '../../common/enums/flight-provider.enum';
import { MystiflyFlightFareRulesResponsesService } from '../../providers/mystifly/flight-fare-rules-responses/mystifly-flight-fare-rules-responses.service';
import { MystiflyFlightRevalidationResponsesService } from '../../providers/mystifly/flight-revalidation-responses/mystifly-flight-revalidation-responses.service';
import { MystiflyPrebookingFlightProcess } from './processes/mystifly-prebooking-flight.process';

@Injectable()
export class PrebookingFlightProcessGateway {
  constructor(
    private readonly mystiflyFlightFareRulesResponsesService: MystiflyFlightFareRulesResponsesService,
    private readonly mystiflyFlightRevalidationResponsesService: MystiflyFlightRevalidationResponsesService,
  ) {}

  instantiate(provider: FlightProvider) {
    switch (provider) {
      case FlightProvider.Mystifly:
        return new MystiflyPrebookingFlightProcess(
          this.mystiflyFlightFareRulesResponsesService,
          this.mystiflyFlightRevalidationResponsesService,
        );
      default:
        break;
    }
  }
}

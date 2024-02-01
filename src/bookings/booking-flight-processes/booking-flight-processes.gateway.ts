import { Injectable } from '@nestjs/common';

import { FlightProvider } from '../../common/enums/flight-provider.enum';
import { MystiflyFlightDetailsService } from '../../providers/mystifly/flight-details/mystifly-flight-details.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MystiflyBookingFlightProcess } from './processes/mystifly-booking-flight.process';

@Injectable()
export class BookingFlightProcessesGateway {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightDetailsService: MystiflyFlightDetailsService,
  ) {}

  instantiate(provider: FlightProvider) {
    switch (provider) {
      case FlightProvider.Mystifly:
        return new MystiflyBookingFlightProcess(
          this.mystiflyFlightDetailsService,
        );
      default:
        this.errorHandlerService.internalServerErrorException(
          'No process for provider...',
        );
        break;
    }
  }
}

import { FlightType } from '../../../common/enums/flight-type.enum';
import { PrebookingFlight } from '../../../prebookings/prebooking-flights/prebooking-flight.entity';

export class AbstractProcessFlightPrebookingDto {
  flightType?: FlightType;
  providerDetails?: any;
  transactionId?: string;
  transactionFlightId?: number;
  prebookingFlight?: PrebookingFlight;
}

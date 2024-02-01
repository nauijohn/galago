import { FlightType } from '../../../common/enums/flight-type.enum';
import { PaymentFlight } from '../../../payments/payment-flights/payment-flight.entity';
import { BookingFlight } from '../../booking-flights/booking-flight.entity';

export class AbstractProcessFlightBookingDto {
  flightType?: FlightType;
  providerDetails?: any;
  bookingFlight?: BookingFlight;
  paymentFlight?: PaymentFlight;
  transactionFlightId?: number;
  bookingFlights?: BookingFlight[];
}

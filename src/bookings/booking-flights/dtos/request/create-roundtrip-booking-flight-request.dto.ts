import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { FlightProvider } from '../../../../common/enums/flight-provider.enum';
import { FlightType } from '../../../../common/enums/flight-type.enum';
import { CustomerDetailBookingRequestDto } from './customer-detail-booking-request.dto';
import { PassengerDetailBookingRequestDto } from './passenger-detail-booking-request.dto';
import { PaymentFlightDetailBookingRequestDto } from './payment-flight-detail-booking-request.dto';

class ProviderDetails {
  departureDetails: any;
  returnDetails: any;
}

export class CreateRoundtripBookingFlightRequestDto {
  @AutoMap()
  flightReference: string;

  @AutoMap()
  origin: string;

  @AutoMap()
  destination: string;

  @AutoMap()
  departureDate: Date;

  returnDate: Date;

  @AutoMap()
  adults: number;

  @AutoMap()
  children?: number;

  @AutoMap()
  infants?: number;

  @AutoMap()
  cabinClass: string;

  @Transform(({ value }) => {
    if (value === 'round-trip') return FlightType.Roundtrip;
    if (value === 'one-way') return FlightType.OneWay;
  })
  flightType: FlightType;

  @Transform(({ value }) => `${value}`.toLowerCase())
  @AutoMap()
  provider: FlightProvider;

  providerDetails: ProviderDetails;
  transactionId?: string;
  paymentFlightDetails: PaymentFlightDetailBookingRequestDto;
  passengerDetails: PassengerDetailBookingRequestDto[];
  customerDetails: CustomerDetailBookingRequestDto;
}

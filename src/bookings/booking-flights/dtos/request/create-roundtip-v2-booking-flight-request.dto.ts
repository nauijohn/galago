import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { FlightProvider } from '../../../../common/enums/flight-provider.enum';
import { CustomerDetailBookingRequestDto } from './customer-detail-booking-request.dto';
import { PassengerDetailBookingRequestDto } from './passenger-detail-booking-request.dto';
import { PaymentFlightDetailBookingRequestDto } from './payment-flight-detail-booking-request.dto';

export class CreateRoundtripV2BookingFlightRequestDto {
  @AutoMap()
  flightReference: string;

  @AutoMap()
  origin: string;

  @AutoMap()
  destination: string;

  @AutoMap()
  departureDate: Date;

  @AutoMap()
  returnDate: Date;

  @AutoMap()
  adults: number;

  @AutoMap()
  children?: number;

  @AutoMap()
  infants?: number;

  @AutoMap()
  cabinClass: string;

  @Transform(({ value }) =>
    `${value}` === '765J' ? FlightProvider.Mystifly : `${value}`.toLowerCase(),
  )
  @AutoMap()
  provider: FlightProvider;

  providerDetails: any;
  transactionId?: string;
  paymentFlightDetails: PaymentFlightDetailBookingRequestDto;
  passengerDetails: PassengerDetailBookingRequestDto[];
  customerDetails: CustomerDetailBookingRequestDto;
}

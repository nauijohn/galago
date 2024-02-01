import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { BookingFlight } from '../../../../bookings/booking-flights/booking-flight.entity';
import { PaymentFlight } from '../../../../payments/payment-flights/payment-flight.entity';
import { PrebookingFlight } from '../../../../prebookings/prebooking-flights/prebooking-flight.entity';
import { CreateTransactionFlightRequestDto } from './create-transaction-flight-request.dto';

export class UpdateTransactionFlightRequestDto extends CreateTransactionFlightRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;

  @AutoMap(() => PrebookingFlight)
  prebookingFlight?: PrebookingFlight;

  @AutoMap(() => PaymentFlight)
  paymentFlight?: PaymentFlight;

  @AutoMap(() => [BookingFlight])
  bookingFlights?: BookingFlight[];
}

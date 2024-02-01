import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { BookingHotel } from '../../../../bookings/booking-hotels/booking-hotel.entity';
import { PaymentHotel } from '../../../../payments/payment-hotels/payment-hotel.entity';
import { PrebookingHotel } from '../../../../prebookings/prebooking-hotels/prebooking-hotel.entity';
import { CreateTransactionHotelRequestDto } from './create-transaction-hotel-request.dto';

export class UpdateTransactionHotelRequestDto extends CreateTransactionHotelRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;

  @AutoMap(() => PrebookingHotel)
  prebookingHotel?: PrebookingHotel;

  @AutoMap(() => PaymentHotel)
  paymentHotel?: PaymentHotel;

  @AutoMap(() => [BookingHotel])
  bookingHotels?: BookingHotel[];
}

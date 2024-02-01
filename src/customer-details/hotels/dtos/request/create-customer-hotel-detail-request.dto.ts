import { AutoMap } from '@automapper/classes';

import { BookingHotel } from '../../../../bookings/booking-hotels/booking-hotel.entity';

export class CreateCustomerHotelDetailRequestDto {
  // @AutoMap()
  // name?: string;

  @AutoMap()
  firstName?: string;

  @AutoMap()
  lastName?: string;

  @AutoMap()
  email?: string;

  @AutoMap()
  mobileNumber?: string;

  @AutoMap()
  bookingHotels?: BookingHotel[];
}

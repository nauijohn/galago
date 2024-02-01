import { BookingHotel } from '../../../bookings/booking-hotels/booking-hotel.entity';
import { PaymentHotel } from '../../../payments/payment-hotels/payment-hotel.entity';

export class AbstractProcessHotelBookingDto {
  providerDetails?: any;
  bookingHotels?: BookingHotel[];
  paymentHotel?: PaymentHotel;
  transactionHotelId?: number;
  providerReference?: string;
}

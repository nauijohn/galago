export class HotelsBookingConfirmationRequestDto {
  to: string;
  subject?: string;
  bookingNumber?: string;
  location?: string;
  bookingStatus?: string;
  checkInDate?: string;
  checkInTime?: string;
  checkOutDate?: string;
  checkOutTime?: string;
  hotelName?: string;
  hotelAddress?: string;
  hotelTel?: string;
  reservations?: string;
  roomTypes?: string;
  leadGuest?: string;
  additionalGuest?: string;
  benefits?: string[];
  specialRequest?: string;
  totalDayRateRoom?: number;
  surcharge?: number;
  roomXnight?: string;
  totalCharge?: number;
  paymentSource?: string;
}

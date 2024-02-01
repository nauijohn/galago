import { UpdateTransactionHotelRequestDto } from '../../transactions/hotels/dtos/request/update-transaction-hotel-request.dto';
import { AbstractProcessHotelBookingDto } from './dtos/abstract-process-hotel-booking.dto';

export abstract class BookingHotelGateway {
  abstract processHotelBooking(
    abstractProcessHotelBookingDto: AbstractProcessHotelBookingDto,
  ): Promise<UpdateTransactionHotelRequestDto>;
}

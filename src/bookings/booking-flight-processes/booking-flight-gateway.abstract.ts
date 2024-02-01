import { UpdateTransactionFlightRequestDto } from '../../transactions/flights/dtos/request/update-transaction-flight-request.dto';
import { AbstractProcessFlightBookingDto } from './dtos/abstract-process-flight-booking.dto';

export abstract class BookingFlightGateway {
  abstract processFlightBooking(
    abstractProcessFlightBookingDto: AbstractProcessFlightBookingDto,
  ): Promise<UpdateTransactionFlightRequestDto>;
}

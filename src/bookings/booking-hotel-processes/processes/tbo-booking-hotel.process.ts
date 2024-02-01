import { TboHotelDetail } from '../../../providers/tbo/hotel-details/tbo-hotel-detail.entity';
import { TboHotelDetailsService } from '../../../providers/tbo/hotel-details/tbo-hotel-details.service';
import { UpdateTransactionHotelRequestDto } from '../../../transactions/hotels/dtos/request/update-transaction-hotel-request.dto';
import { BookingHotelGateway } from '../booking-hotel-gateway.abstract';
import { AbstractProcessHotelBookingDto } from '../dtos/abstract-process-hotel-booking.dto';

export class TboBookingHotelProcess implements BookingHotelGateway {
  constructor(
    private readonly tboHotelDetailsService: TboHotelDetailsService,
  ) {}

  async processHotelBooking(
    abstractProcessHotelBookingDto: AbstractProcessHotelBookingDto,
  ): Promise<UpdateTransactionHotelRequestDto> {
    const {
      bookingHotels,
      paymentHotel,
      providerDetails,
      providerReference,
      transactionHotelId,
    } = abstractProcessHotelBookingDto;

    const updateTransactionHotelRequestDto: UpdateTransactionHotelRequestDto = {
      id: transactionHotelId,
      paymentHotel: paymentHotel,
    };

    providerDetails.providerReference = providerReference;

    const tboHotelDetails: TboHotelDetail[] = await Promise.all(
      providerDetails.Rooms.map((room) => {
        const providerDetail = structuredClone(providerDetails);
        providerDetail.Rooms = [room];
        return this.tboHotelDetailsService.create(providerDetail);
      }),
    );

    updateTransactionHotelRequestDto.bookingHotels = tboHotelDetails.map(
      (tboHotelDetail, index) => {
        const bookingHotelTemp = structuredClone(bookingHotels[index]);
        bookingHotelTemp.tboHotelDetail = tboHotelDetail;
        bookingHotelTemp.adults = tboHotelDetail.rooms[0].Adults;
        bookingHotelTemp.children = tboHotelDetail.rooms[0].Children;
        return bookingHotelTemp;
      },
    );

    return updateTransactionHotelRequestDto;
  }
}

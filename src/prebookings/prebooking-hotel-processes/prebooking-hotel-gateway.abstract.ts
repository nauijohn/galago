import { UpdateTransactionHotelRequestDto } from '../../transactions/hotels/dtos/request/update-transaction-hotel-request.dto';

export abstract class PrebookingHotelGateway {
  abstract processHotelPrebooking(
    processHotelPrebookingDto: any,
  ): Promise<UpdateTransactionHotelRequestDto>;
}

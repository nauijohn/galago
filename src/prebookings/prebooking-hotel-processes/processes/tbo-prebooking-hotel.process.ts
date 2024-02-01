import { TboHotelPrebookResponsesService } from '../../../providers/tbo/hotel-prebook-responses/tbo-hotel-prebook-responses.service';
import { UpdateTransactionHotelRequestDto } from '../../../transactions/hotels/dtos/request/update-transaction-hotel-request.dto';
import { AbstractProcessHotelPrebookingDto } from '../dtos/abstract-process-hotel-prebooking.dto';
import { PrebookingHotelGateway } from '../prebooking-hotel-gateway.abstract';

export class TboPrebookingHotelProcess implements PrebookingHotelGateway {
  constructor(
    private readonly tboHotelPrebookResponsesService: TboHotelPrebookResponsesService,
  ) {}

  async processHotelPrebooking(
    processHotelPrebookingDto: AbstractProcessHotelPrebookingDto,
  ): Promise<UpdateTransactionHotelRequestDto> {
    const { transactionHotelId, prebookingHotel, providerDetails } =
      processHotelPrebookingDto;

    const updateTransactionHotelRequestDto: UpdateTransactionHotelRequestDto = {
      id: transactionHotelId,
      prebookingHotel,
    };

    const tboHotelPrebookResponses = await Promise.all(
      providerDetails.Rooms.map((room) =>
        this.tboHotelPrebookResponsesService.create({
          ...providerDetails,
          Rooms: [room],
        }),
      ),
    );
    updateTransactionHotelRequestDto.prebookingHotel.tboHotelPrebookResponses =
      tboHotelPrebookResponses;

    return updateTransactionHotelRequestDto;
  }
}

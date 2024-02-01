import { UpdateTransactionFlightRequestDto } from '../../transactions/flights/dtos/request/update-transaction-flight-request.dto';
import { AbstractProcessFlightPrebookingDto } from './dtos/abstract-process-flight-prebooking.dto';

export abstract class PrebookingFlightGateway {
  abstract processFlightPrebooking(
    processFlightPrebookingDto: AbstractProcessFlightPrebookingDto,
  ): Promise<UpdateTransactionFlightRequestDto>;
}

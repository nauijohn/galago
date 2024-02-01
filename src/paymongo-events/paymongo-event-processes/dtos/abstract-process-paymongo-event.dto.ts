import { TransactionFlight } from '../../../transactions/flights/transaction-flight.entity';
import { TransactionHotel } from '../../../transactions/hotels/transaction-hotel.entity';

export class AbstractProcessPaymongoEventDto {
  transactionFlight?: TransactionFlight;
  transactionHotel?: TransactionHotel;
}

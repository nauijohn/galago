import { PrebookingHotel } from '../../../prebookings/prebooking-hotels/prebooking-hotel.entity';

export class AbstractProcessHotelPrebookingDto {
  providerDetails?: any;
  transactionHotelId?: number;
  prebookingHotel?: PrebookingHotel;
}

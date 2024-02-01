import { AutoMap } from '@automapper/classes';

import { HotelProvider } from '../../../../common/enums/hotel-provider.enum';

export class CreatePrebookingHotelRequestDto {
  transactionId?: string;

  @AutoMap()
  provider?: HotelProvider;

  providerDetails?: any;

  @AutoMap()
  quantity?: number;
}

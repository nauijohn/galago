import { AutoMap } from '@automapper/classes';

import { TboRooms } from '../../../../../providers/tbo/hotel-utils/hotels/dtos/response/tbo-search-hotels-response.dto';

export class CreateTboHotelPrebookResponseRequestDto {
  @AutoMap()
  HotelCode?: string;

  @AutoMap()
  Currency?: string;

  @AutoMap(() => [TboRooms])
  Rooms?: TboRooms[];

  @AutoMap(() => Array<string>)
  RateConditions?: string[];
}

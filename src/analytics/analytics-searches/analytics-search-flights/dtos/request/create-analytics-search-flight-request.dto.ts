import { AutoMap } from '@automapper/classes';

import { MystiflySearch } from '../../../../../providers/mystifly/flight-utils/dtos/response/mystifly-search-response.dto';

export class CreateAnalyticsSearchFlightRequestDto {
  @AutoMap(() => Array<MystiflySearch>)
  economy?: MystiflySearch[];

  @AutoMap(() => Array<MystiflySearch>)
  business?: MystiflySearch[];

  @AutoMap(() => Array<MystiflySearch>)
  first?: MystiflySearch[];

  @AutoMap(() => Array<MystiflySearch>)
  premiumEconomy?: MystiflySearch[];

  @AutoMap()
  provider?: string;

  @AutoMap()
  flightType?: string;
}

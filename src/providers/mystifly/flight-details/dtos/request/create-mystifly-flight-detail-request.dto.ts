import { AutoMap } from '@automapper/classes';

import {
  FlightFares,
  OriginDestinations,
  PenaltiesInfo,
} from '../../../flight-utils/dtos/response/mystifly-search-response.dto';

export class CreateMystiflyFlightDetailRequestDto {
  @AutoMap()
  FareSourceCode?: string;

  @AutoMap()
  ValidatingCarrier?: string;

  @AutoMap(() => Array<OriginDestinations>)
  OriginDestinations?: OriginDestinations[];

  @AutoMap(() => FlightFares)
  FlightFares?: FlightFares;

  @AutoMap(() => PenaltiesInfo)
  PenaltiesInfo?: PenaltiesInfo;

  providerReference?: string;

  paymentReferenceNumber?: string;

  sequence?: number;
}

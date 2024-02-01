import { AutoMap } from '@automapper/classes';

import {
  MystiflyRevalidationDataError,
  MystiflyRevalidationExtraServices,
  MystiflyRevalidationPricedItineraries,
} from '../../../../../providers/mystifly/flight-utils/dtos/response/mystifly-revalidation-response.dto';

export class CreateMystiflyFlightRevalidationResponseRequestDto {
  @AutoMap(() => Array<MystiflyRevalidationPricedItineraries>)
  PricedItineraries?: MystiflyRevalidationPricedItineraries[];

  @AutoMap()
  ConversationId?: string;

  @AutoMap(() => Array<MystiflyRevalidationDataError>)
  Errors?: MystiflyRevalidationDataError[];

  @AutoMap(() => Array<MystiflyRevalidationExtraServices>)
  ExtraServices?: MystiflyRevalidationExtraServices[];

  @AutoMap()
  TraceId?: string;

  @AutoMap()
  IsValidReason?: string;

  providerReference?: string;
  sequence?: number;

  transactionId?: string;
}

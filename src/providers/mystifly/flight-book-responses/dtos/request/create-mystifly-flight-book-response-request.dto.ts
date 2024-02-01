import { AutoMap } from '@automapper/classes';

import { MystiflyBookDataError } from '../../../../../providers/mystifly/flight-utils/dtos/response/mystifly-book-response.dto';

export class CreateMystiflyFlightBookResponseRequestDto {
  @AutoMap()
  ClientUTCOffset?: number;

  @AutoMap()
  ConversationId?: string;

  @AutoMap(() => Array<MystiflyBookDataError>)
  Errors?: MystiflyBookDataError[];

  @AutoMap()
  Status?: string;

  @AutoMap()
  TktTimeLimit?: string;

  @AutoMap()
  TraceId?: string;

  @AutoMap()
  UniqueID?: string;

  @AutoMap()
  providerReference?: string;

  @AutoMap()
  paymentReferenceNumber?: string;

  @AutoMap()
  sequence?: number;

  @AutoMap()
  userId?: string;

  @AutoMap()
  fareSourceCode?: string;
}

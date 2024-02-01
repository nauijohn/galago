import { AutoMap } from '@automapper/classes';

import {
  MystiflyFareRulesBaggageInfos,
  MystiflyFareRulesDataError,
  MystiflyFareRulesFareRules,
} from '../../../flight-utils/dtos/response/mystifly-fare-rules-response.dto';

export class CreateMystiflyFlightFareRulesResponseRequestDto {
  @AutoMap(() => MystiflyFareRulesBaggageInfos)
  BaggageInfos?: MystiflyFareRulesBaggageInfos;

  @AutoMap()
  ConversationId?: string;

  @AutoMap(() => Array<MystiflyFareRulesDataError>)
  Errors?: MystiflyFareRulesDataError[];

  @AutoMap(() => MystiflyFareRulesFareRules)
  FareRules?: MystiflyFareRulesFareRules;

  @AutoMap()
  TraceId?: string;

  sequence?: number;
  providerReference?: string;
  transactionId?: string;
}

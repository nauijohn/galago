import { AutoMap } from '@automapper/classes';

import {
  MystiflyFareRulesBaggageInfos,
  MystiflyFareRulesDataError,
  MystiflyFareRulesFareRules,
} from '../../../../../providers/mystifly/flight-utils/dtos/response/mystifly-fare-rules-response.dto';

export class CreateMystiflyFlightRoundtripFareRulesFareRulesResponseRequest {
  @AutoMap(() => MystiflyFareRulesBaggageInfos)
  BaggageInfos: MystiflyFareRulesBaggageInfos;

  @AutoMap()
  ConversationId: string;

  @AutoMap(() => Array<MystiflyFareRulesDataError>)
  Errors: MystiflyFareRulesDataError[];

  @AutoMap(() => MystiflyFareRulesFareRules)
  FareRules: MystiflyFareRulesFareRules;

  @AutoMap()
  TraceId: string;
}

export class CreateMystiflyFlightRoundtripFareRulesResponseRequestDto {
  transactionId: string;
  departureFareRulesResponse: CreateMystiflyFlightRoundtripFareRulesFareRulesResponseRequest;
  returnFareRulesResponse: CreateMystiflyFlightRoundtripFareRulesFareRulesResponseRequest;
}

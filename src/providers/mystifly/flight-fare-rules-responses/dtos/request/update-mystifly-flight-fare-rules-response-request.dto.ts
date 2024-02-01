import { Transform } from 'class-transformer';

import { CreateMystiflyFlightFareRulesResponseRequestDto } from './create-mystifly-flight-fare-rules-response-request.dto';

export class UpdateMystiflyFlightFareRulesResponseRequestDto extends CreateMystiflyFlightFareRulesResponseRequestDto {
  @Transform(({ value }) => parseInt(value))
  id: number;
}

import { Transform } from 'class-transformer';

import { CreateMystiflyFlightRevalidationResponseRequestDto } from './create-mystifly-flight-revalidation-response-request.dto';

export class UpdateMystiflyFlightRevalidationResponseRequestDto extends CreateMystiflyFlightRevalidationResponseRequestDto {
  @Transform(({ value }) => parseInt(value))
  id: number;
}

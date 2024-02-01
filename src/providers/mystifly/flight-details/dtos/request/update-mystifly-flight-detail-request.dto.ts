import { Transform } from 'class-transformer';

import { CreateMystiflyFlightDetailRequestDto } from './create-mystifly-flight-detail-request.dto';

export class UpdateMystiflyFlightDetailRequestDto extends CreateMystiflyFlightDetailRequestDto {
  @Transform(({ value }) => parseInt(value))
  id: number;
}

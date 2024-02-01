import { Transform } from 'class-transformer';

import { CreateTboHotelPrebookResponseRequestDto } from './create-tbo-hotel-prebook-response-request.dto';

export class UpdateTboHotelPrebookResponseRequestDto extends CreateTboHotelPrebookResponseRequestDto {
  @Transform(({ value }) => parseInt(value))
  id: number;
}

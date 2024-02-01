import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { CreateMystiflyFlightBookResponseRequestDto } from './create-mystifly-flight-book-response-request.dto';

export class UpdateMystiflyFlightBookResponseRequestDto extends CreateMystiflyFlightBookResponseRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}

import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { CreatePassengerDetailRequestDto } from './create-passenger-detail-request.dto';

export class UpdatePassengerDetailRequestDto extends CreatePassengerDetailRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}

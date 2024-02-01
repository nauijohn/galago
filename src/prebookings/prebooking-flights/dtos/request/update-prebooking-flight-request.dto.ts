import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { CreatePrebookingFlightRequestDto } from './create-prebooking-flight-request.dto';

export class UpdatePrebookingFlightRequestDto extends CreatePrebookingFlightRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}

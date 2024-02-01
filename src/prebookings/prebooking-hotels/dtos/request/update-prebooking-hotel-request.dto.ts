import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { CreatePrebookingHotelRequestDto } from './create-prebooking-hotel-request.dto';

export class UpdatePrebookingHotelRequestDto extends CreatePrebookingHotelRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}

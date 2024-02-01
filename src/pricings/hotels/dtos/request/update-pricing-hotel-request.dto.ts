import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { CreatePricingHotelRequestDto } from './create-pricing-hotel-request.dto';

export class UpdatePricingHotelRequestDto extends CreatePricingHotelRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}

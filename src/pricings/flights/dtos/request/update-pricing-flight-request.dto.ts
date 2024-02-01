import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { AutoMap } from '@automapper/classes';

import { CreatePricingFlightRequestDto } from './create-pricing-flight-request.dto';

export class UpdatePricingFlightRequestDto extends CreatePricingFlightRequestDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @AutoMap()
  id: number;
}

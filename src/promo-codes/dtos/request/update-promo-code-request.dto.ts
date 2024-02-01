import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { CreatePromoCodeRequestDto } from './create-promo-code-request.dto';

export class UpdatePromoCodeRequestDto extends CreatePromoCodeRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}

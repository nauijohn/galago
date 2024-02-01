import { Transform } from 'class-transformer';

import { CreateTboHotelDetailRequestDto } from './create-tbo-hotel-detail-request.dto';

export class UpdateTboHotelDetailRequestDto extends CreateTboHotelDetailRequestDto {
  @Transform(({ value }) => parseInt(value))
  id: number;
}

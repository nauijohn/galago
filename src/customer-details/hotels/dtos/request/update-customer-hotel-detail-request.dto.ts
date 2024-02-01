import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { CreateCustomerHotelDetailRequestDto } from './create-customer-hotel-detail-request.dto';

export class UpdateCustomerHotelDetailRequestDto extends CreateCustomerHotelDetailRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}

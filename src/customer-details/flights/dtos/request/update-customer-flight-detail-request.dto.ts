import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { CreateCustomerFlightDetailRequestDto } from './create-customer-flight-detail-request.dto';

export class UpdateCustomerFlightDetailRequestDto extends CreateCustomerFlightDetailRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}

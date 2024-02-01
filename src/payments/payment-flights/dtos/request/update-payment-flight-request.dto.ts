import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { CreatePaymentFlightRequestDto } from './create-payment-flight-request.dto';

export class UpdatePaymentFlightRequestDto extends CreatePaymentFlightRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}

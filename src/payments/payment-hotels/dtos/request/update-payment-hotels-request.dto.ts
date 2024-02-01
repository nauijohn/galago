import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { PaymentStatus } from '../../../../payments/payment-status.enum';
import { CreatePaymentHotelsRequestDto } from './create-payment-hotels-request.dto';

export class UpdatePaymentHotelsRequestDto extends CreatePaymentHotelsRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;

  @AutoMap()
  status?: PaymentStatus;
}

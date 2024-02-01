import { AutoMap } from '@automapper/classes';

export class CreatePaymentHotelsRequestDto {
  @AutoMap()
  name?: string;

  @AutoMap()
  amount?: number;

  @AutoMap()
  discount?: number;

  @AutoMap()
  referenceNumber?: string;

  @AutoMap()
  paymentIntentId?: string;
}

import { AutoMap } from '@automapper/classes';

export class CreatePaymentFlightRequestDto {
  @AutoMap()
  name?: string;

  @AutoMap()
  amount?: number;

  @AutoMap()
  referenceNumber?: string;

  @AutoMap()
  paymentIntentId?: string;

  promoCodes?: string[];
}

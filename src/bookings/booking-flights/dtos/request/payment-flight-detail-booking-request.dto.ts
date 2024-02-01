import { Transform } from 'class-transformer';

export class PaymentFlightDetailBookingRequestDto {
  name?: string;

  @Transform(({ value }) => parseInt(value))
  amount?: number;

  referenceNumber?: string;

  paymentIntentId?: string;

  promoCodes?: string[];
}

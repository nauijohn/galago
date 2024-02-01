import { Platform } from '../../../common/enums/platform.enum';
import { Product } from '../../../common/enums/product.enum';

class PaymentCheckoutSessionLineItem {
  amount: number;
  currency: string;
  description: string;
  images: string[];
  name: string;
  quantity: number;
}

export class PaymentCheckoutSessionRequestDto {
  description: string;
  line_items: PaymentCheckoutSessionLineItem[];
  reference_number?: string;
  product: Product;
  platform: Platform;
  referenceNumber: string;
}

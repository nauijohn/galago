import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Platform } from '../common/enums/platform.enum';
import { PAYMONGO_REDIRECT_BASE_URL } from '../config/config.constant';
import { PaymongoService } from '../providers/paymongo/paymongo.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { SecurityService } from '../utils/security.service';
import { PaymentCheckoutSessionRequestDto } from './dtos/request/payment-checkout-session-request.dto';

@Injectable()
export class PaymentsService {
  private readonly PAYMONGO_REDIRECT_BASE_URL;
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly paymongoService: PaymongoService,
    private readonly configService: ConfigService,
    private readonly securityService: SecurityService,
  ) {
    this.PAYMONGO_REDIRECT_BASE_URL = this.configService.get(
      PAYMONGO_REDIRECT_BASE_URL,
    );
  }

  async checkoutSession(
    paymentCheckoutSessionRequestDto: PaymentCheckoutSessionRequestDto,
  ) {
    this.loggerService.log('checkoutSession...');

    const { description, line_items, platform, product, referenceNumber } =
      paymentCheckoutSessionRequestDto;

    const paymentReference = referenceNumber ?? 'test';

    const encryptedPaymentReference =
      await this.securityService.encryptWordForURL(paymentReference);

    let success_url = `${this.PAYMONGO_REDIRECT_BASE_URL}?paymentReference=${encryptedPaymentReference}`;
    if (platform === Platform.Web)
      success_url = `${this.PAYMONGO_REDIRECT_BASE_URL}?paymentReference=${encryptedPaymentReference}`;
    if (platform === Platform.Mobile)
      success_url = `${this.PAYMONGO_REDIRECT_BASE_URL}?paymentReference=${encryptedPaymentReference}&platform=mobile`;

    const { data } = await this.paymongoService.checkoutSession({
      data: {
        attributes: {
          billing: null,
          cancel_url: null,
          description,
          line_items,
          payment_method_types: [
            'card',
            'dob',
            'dob_ubp',
            'gcash',
            'grab_pay',
            'paymaya',
          ],
          reference_number: referenceNumber,
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          success_url,
          statement_descriptor: null,
        },
      },
    });

    return data;
  }
}

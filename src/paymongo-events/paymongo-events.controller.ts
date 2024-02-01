import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreatePaymongoEventRequestDto } from './dtos/request/create-paymongo-event-request.dto';
import { PaymongoEventsService } from './paymongo-events.service';

@Controller('paymongo-events')
@ApiTags('Paymongo Events')
export class PaymongoEventsController {
  constructor(
    private readonly paymongoEventsService: PaymongoEventsService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post()
  @Public()
  async create(@Body() requestDto: CreatePaymongoEventRequestDto) {
    this.loggerService.log('create...');

    this.loggerService.debug('requestDto: ', requestDto);

    const [paymongoEvent] = await Promise.all([
      this.paymongoEventsService.create(requestDto),
      this.paymongoEventsService.verifyPayment(requestDto),
    ]);

    return {
      statusCode: HttpStatus.OK,
      data: { paymongoEvent },
    };
  }

  @Get('payment-intent/:id')
  @Public()
  async fetchCheckoutSessionTypeByPaymentIntentId(
    @Param('id') paymentIntentId: string,
  ) {
    this.loggerService.log('fetchCheckoutSessionTypeByPaymentIntentId...');
    return await this.paymongoEventsService.fetchCheckoutSessionTypeByPaymentIntentId(
      paymentIntentId,
    );
  }
}

import { Injectable } from '@nestjs/common';

import { FlightProvider } from '../common/enums/flight-provider.enum';
import { HotelProvider } from '../common/enums/hotel-provider.enum';
import { Product } from '../common/enums/product.enum';
import { PaymentFlightsService } from '../payments/payment-flights/payment-flights.service';
import { PaymentHotelsService } from '../payments/payment-hotels/payment-hotels.service';
import { PaymentStatus } from '../payments/payment-status.enum';
import { TransactionFlight } from '../transactions/flights/transaction-flight.entity';
import { TransactionFlightsService } from '../transactions/flights/transaction-flights.service';
import { TransactionHotel } from '../transactions/hotels/transaction-hotel.entity';
import { TransactionHotelsService } from '../transactions/hotels/transaction-hotels.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreatePaymongoEventRequestDto } from './dtos/request/create-paymongo-event-request.dto';
import { PaymongoEventProcessesService } from './paymongo-event-processes/paymongo-event-processes.service';
import { PaymongoEventsRepository } from './paymongo-events.repository';

const PaymentPaid = 'payment.paid';

enum Transaction {
  Hotels = 'hotels',
  Flights = 'flights',
}

@Injectable()
export class PaymongoEventsService {
  constructor(
    private readonly paymongoEventsRepository: PaymongoEventsRepository,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly paymentHotelsService: PaymentHotelsService,
    private readonly paymentFlightsService: PaymentFlightsService,
    private readonly transactionFlightsService: TransactionFlightsService,
    private readonly transactionHotelsService: TransactionHotelsService,

    private readonly paymongoEventProcessesService: PaymongoEventProcessesService,
  ) {}

  async create(createPaymongoEventRequestDto: CreatePaymongoEventRequestDto) {
    this.loggerService.log('create...');

    return await this.paymongoEventsRepository.create(
      createPaymongoEventRequestDto,
    );
  }

  async verifyPayment(
    createPaymongoEventRequestDto: CreatePaymongoEventRequestDto,
  ) {
    this.loggerService.log('verifyPayment...');

    const { canProceed, paymentIntentId, sourcePayments } =
      this.extractAttributes(createPaymongoEventRequestDto);
    if (!canProceed) return;

    const { type, transaction, provider } = await this.determineTransaction(
      paymentIntentId,
    );

    switch (type) {
      case Transaction.Flights: {
        await this.processFlights(
          paymentIntentId,
          provider as FlightProvider,
          transaction as TransactionFlight,
        );
        break;
      }

      case Transaction.Hotels: {
        await this.processHotels(
          paymentIntentId,
          provider as HotelProvider,
          transaction as TransactionHotel,
        );
        break;
      }

      default: {
        this.errorHandlerService.error('No transaction type...');
        break;
      }
    }
  }

  async fetchCheckoutSessionTypeByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('fetchCheckoutSessionTypeByPaymentIntentId...');
    return await this.paymongoEventsRepository.fetchCheckoutSessionTypeByPaymentIntentId(
      paymentIntentId,
    );
  }

  private extractAttributes(
    createPaymongoEventRequestDto: CreatePaymongoEventRequestDto,
  ) {
    console.log(
      'createPaymongoEventRequestDto: ',
      createPaymongoEventRequestDto,
    );
    const { data } = createPaymongoEventRequestDto;
    const { attributes } = data;
    const { type, data: data2 } = attributes;
    const { attributes: attributes2 } = data2;
    const { payment_intent_id, status, payments } = attributes2;
    const { attributes: attributesPayments } = payments[0];
    const { source: sourcePayments } = attributesPayments;
    const paymentIntentId = `${payment_intent_id}`;
    const canProceed = type === PaymentPaid && status === PaymentStatus.Paid;
    return { canProceed, paymentIntentId, sourcePayments };
  }

  private async fetchTransactions(paymentIntentId: string) {
    this.loggerService.log('fetchTransactions...');
    const [transactionFlight, transactionHotel] = await Promise.all<
      [Promise<TransactionFlight>, Promise<TransactionHotel>]
    >([
      this.transactionFlightsService
        .fetchByPaymentIntentIdWithoutUserId(paymentIntentId)
        .catch((err) => err),
      this.transactionHotelsService
        .fetchByPaymentIntentIdWithoutUserId(paymentIntentId)
        .catch((err) => err),
    ]);
    return { transactionFlight, transactionHotel };
  }

  private async determineTransaction(paymentIntentId: string) {
    const { transactionFlight, transactionHotel } =
      await this.fetchTransactions(paymentIntentId);

    if (transactionFlight instanceof TransactionFlight && transactionFlight)
      return {
        type: Transaction.Flights,
        transaction: transactionFlight,
        provider: transactionFlight.prebookingFlight.provider,
      };
    if (transactionHotel instanceof TransactionHotel && transactionHotel)
      return {
        type: Transaction.Hotels,
        transaction: transactionHotel,
        provider: transactionHotel.prebookingHotel.provider,
      };

    return {
      type: undefined,
      transaction: undefined,
      provider: undefined,
    };
  }

  private async processFlights(
    paymentIntentId: string,
    provider: FlightProvider,
    transactionFlight: TransactionFlight,
  ) {
    await Promise.all([
      this.paymentFlightsService.updateStatusToPaidByPaymentIntentId(
        paymentIntentId,
      ),
      this.paymongoEventProcessesService.processPaymongoEvent(
        Product.Flights,
        provider,
        { transactionFlight },
      ),
    ]);
  }

  private async processHotels(
    paymentIntentId: string,
    provider: HotelProvider,
    transactionHotel: TransactionHotel,
  ) {
    await Promise.all([
      this.paymentHotelsService.updateStatusToPaidByPaymentIntentId(
        paymentIntentId,
      ),
      this.paymongoEventProcessesService.processPaymongoEvent(
        Product.Hotels,
        provider,
        { transactionHotel },
      ),
    ]);
  }
}

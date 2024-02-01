import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { FlightType } from '../../common/enums/flight-type.enum';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CustomerFlightDetail } from '../../customer-details/flights/customer-flight-detail.entity';
import { CustomerFlightDetailsService } from '../../customer-details/flights/customer-flight-details.service';
import { PassengerDetail } from '../../flights/passenger-details/passenger-detail.entity';
import { PassengerDetailsService } from '../../flights/passenger-details/passenger-details.service';
import { PaymentFlight } from '../../payments/payment-flights/payment-flight.entity';
import { PaymentFlightsService } from '../../payments/payment-flights/payment-flights.service';
import { TransactionFlight } from '../../transactions/flights/transaction-flight.entity';
import { TransactionFlightsService } from '../../transactions/flights/transaction-flights.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { BookingFlightProcessesService } from '../booking-flight-processes/booking-flight-processes.service';
import { BookingFlight } from './booking-flight.entity';
import { BookingFlightsRepository } from './booking-flights.repository';
import { CreateBookingFlightRequestDto } from './dtos/request/create-booking-flight-request.dto';
import { CreateOneWayBookingFlightRequestDto } from './dtos/request/create-one-way-booking-flight-request.dto';
import { CreateRoundtripV2BookingFlightRequestDto } from './dtos/request/create-roundtip-v2-booking-flight-request.dto';
import { CreateRoundtripBookingFlightRequestDto } from './dtos/request/create-roundtrip-booking-flight-request.dto';
import { CustomerDetailBookingRequestDto } from './dtos/request/customer-detail-booking-request.dto';
import { PassengerDetailBookingRequestDto } from './dtos/request/passenger-detail-booking-request.dto';
import { PaymentFlightDetailBookingRequestDto } from './dtos/request/payment-flight-detail-booking-request.dto';
import { UpdateBookingFlightRequestDto } from './dtos/request/update-booking-flight-request.dto';

@Injectable()
export class BookingFlightsService {
  constructor(
    @InjectMapper()
    private readonly classMapper: Mapper,
    @Inject(REQUEST)
    private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly bookingFlightsRepository: BookingFlightsRepository,
    private readonly paymentFlightsService: PaymentFlightsService,
    private readonly transactionFlightsService: TransactionFlightsService,
    private readonly customerFlightDetailsService: CustomerFlightDetailsService,
    private readonly passengerDetailsService: PassengerDetailsService,
    private readonly bookingFlightProcessesService: BookingFlightProcessesService,
  ) {}

  async create(requestDto: CreateBookingFlightRequestDto) {
    this.loggerService.log('create...');
  }

  async createOneWay(requestDto: CreateOneWayBookingFlightRequestDto) {
    this.loggerService.log('createOneWay...');

    const { transactionFlight, paymentFlight } =
      await this.fetchTransactionAndPayment(
        requestDto.paymentFlightDetails.referenceNumber,
        requestDto.transactionId,
      );

    this.validationBookingFlight(transactionFlight, paymentFlight);

    const { newCustomerFlightDetail, newPassengerDetails, newPaymentFlight } =
      await this.createCustomerAndPaymentAndPassenger(
        requestDto.customerDetails,
        requestDto.paymentFlightDetails,
        requestDto.passengerDetails,
      );

    const entity = this.constructEntity(
      requestDto,
      newCustomerFlightDetail,
      newPassengerDetails,
      transactionFlight,
    );

    const entityNew = await this.bookingFlightsRepository.create(entity);

    const updateTransactionFlightRequestDto =
      await this.bookingFlightProcessesService.processFlightBooking(
        requestDto.provider,
        {
          flightType: FlightType.OneWay,
          providerDetails: requestDto.providerDetails,
          bookingFlight: entityNew,
          paymentFlight: newPaymentFlight,
          transactionFlightId: transactionFlight.id,
        },
      );

    const { bookingFlights } = await this.transactionFlightsService.update(
      updateTransactionFlightRequestDto,
    );

    return bookingFlights;
  }

  async createRoundtripV2(
    requestDto: CreateRoundtripV2BookingFlightRequestDto,
  ) {
    this.loggerService.log('createRountripV2...');

    const { transactionFlight, paymentFlight } =
      await this.fetchTransactionAndPayment(
        requestDto.paymentFlightDetails.referenceNumber,
        requestDto.transactionId,
      );

    this.validationBookingFlight(transactionFlight, paymentFlight);

    const { newCustomerFlightDetail, newPassengerDetails, newPaymentFlight } =
      await this.createCustomerAndPaymentAndPassenger(
        requestDto.customerDetails,
        requestDto.paymentFlightDetails,
        requestDto.passengerDetails,
      );

    const entity = this.constructEntity(
      requestDto,
      newCustomerFlightDetail,
      newPassengerDetails,
      transactionFlight,
    );

    const entityNew = await this.bookingFlightsRepository.create(entity);

    const updateTransactionFlightRequestDto =
      await this.bookingFlightProcessesService.processFlightBooking(
        requestDto.provider,
        {
          flightType: FlightType.Roundtrip,
          providerDetails: requestDto.providerDetails,
          bookingFlight: entityNew,
          paymentFlight: newPaymentFlight,
          transactionFlightId: transactionFlight.id,
        },
      );

    const { bookingFlights } = await this.transactionFlightsService.update(
      updateTransactionFlightRequestDto,
    );

    return bookingFlights;
  }

  async fetchAll(): Promise<BookingFlight[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<BookingFlight[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.bookingFlightsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.bookingFlightsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.bookingFlightsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');
    return entity;
  }

  async update(requestDto: UpdateBookingFlightRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateBookingFlightRequestDto,
      BookingFlight,
    );

    return await this.bookingFlightsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.bookingFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async createRoundtripV1(requestDto: CreateRoundtripBookingFlightRequestDto) {
    this.loggerService.log('createRoundtripV1...');

    const { transactionFlight, paymentFlight } =
      await this.fetchTransactionAndPayment(
        requestDto.paymentFlightDetails.referenceNumber,
        requestDto.transactionId,
      );

    this.validationBookingFlight(transactionFlight, paymentFlight);

    const { newCustomerFlightDetail, newPassengerDetails, newPaymentFlight } =
      await this.createCustomerAndPaymentAndPassenger(
        requestDto.customerDetails,
        requestDto.paymentFlightDetails,
        requestDto.passengerDetails,
      );

    const { entityDeparture, entityReturn } = this.constructEntityRountripV1(
      requestDto,
      newCustomerFlightDetail,
      newPassengerDetails,
      transactionFlight,
    );

    const entityNew = await Promise.all([
      this.bookingFlightsRepository.create(entityDeparture),
      this.bookingFlightsRepository.create(entityReturn),
    ]);

    const updateTransactionFlightRequestDto =
      await this.bookingFlightProcessesService.processFlightBooking(
        requestDto.provider,
        {
          flightType: FlightType.RoundtripOld,
          providerDetails: requestDto.providerDetails,
          bookingFlights: entityNew,
          paymentFlight: newPaymentFlight,
          transactionFlightId: transactionFlight.id,
        },
      );

    const { bookingFlights } = await this.transactionFlightsService.update(
      updateTransactionFlightRequestDto,
    );

    return bookingFlights;
  }

  validationBookingFlight(
    transactionFlight: TransactionFlight,
    paymentFlight: any,
  ) {
    if (transactionFlight.bookingFlights.length !== 0)
      this.errorHandlerService.internalServerErrorException(
        'Transaction already booked!',
      );

    if (paymentFlight)
      if (paymentFlight instanceof PaymentFlight)
        this.errorHandlerService.internalServerErrorException(
          'PaymentFlight: referenceNumber already exists',
        );
  }

  async fetchTransactionAndPayment(
    paymentReference: string,
    transactionId: string,
  ) {
    const [transactionFlight, paymentFlight] = await Promise.all([
      this.transactionFlightsService.fetchByTransactionId(transactionId),
      this.paymentFlightsService
        .fetchByReferenceNumber(paymentReference)
        .catch((err) => err),
    ]);

    return { transactionFlight, paymentFlight };
  }

  async createCustomerAndPaymentAndPassenger(
    customerDetails: CustomerDetailBookingRequestDto,
    paymentFlightDetails: PaymentFlightDetailBookingRequestDto,
    passengerDetails: PassengerDetailBookingRequestDto[],
  ) {
    const [newCustomerFlightDetail, newPaymentFlight, newPassengerDetails] =
      await Promise.all([
        this.customerFlightDetailsService.create(customerDetails),
        this.paymentFlightsService.create(paymentFlightDetails),
        Promise.all(
          passengerDetails.map((passengerDetails) =>
            this.passengerDetailsService.create(passengerDetails),
          ),
        ),
      ]);

    return { newCustomerFlightDetail, newPaymentFlight, newPassengerDetails };
  }

  constructEntity(
    requestDto:
      | CreateBookingFlightRequestDto
      | CreateRoundtripV2BookingFlightRequestDto,
    customerFlightDetail: CustomerFlightDetail,
    passengerDetails: PassengerDetail[],
    transactionFlight: TransactionFlight,
  ) {
    let entity: BookingFlight;

    if (requestDto instanceof CreateBookingFlightRequestDto)
      entity = this.classMapper.map(
        requestDto,
        CreateBookingFlightRequestDto,
        BookingFlight,
      );

    if (requestDto instanceof CreateRoundtripV2BookingFlightRequestDto)
      entity = this.classMapper.map(
        requestDto,
        CreateRoundtripV2BookingFlightRequestDto,
        BookingFlight,
      );

    entity.userId = this.request.user?.id ?? null;
    entity.customerFlightDetail = customerFlightDetail;
    entity.passengerDetails = passengerDetails;
    entity.transactionFlight = transactionFlight;
    entity.flightReference = transactionFlight.flightReference;
    entity.providerReference =
      transactionFlight.prebookingFlight.providerReference;

    return entity;
  }

  constructEntityRountripV1(
    requestDto: CreateRoundtripBookingFlightRequestDto,
    customerFlightDetail: CustomerFlightDetail,
    passengerDetails: PassengerDetail[],
    transactionFlight: TransactionFlight,
  ) {
    const entityDeparture = this.classMapper.map(
      requestDto,
      CreateRoundtripBookingFlightRequestDto,
      BookingFlight,
    );
    entityDeparture.userId = this.request.user?.id ?? null;
    entityDeparture.customerFlightDetail = customerFlightDetail;
    entityDeparture.passengerDetails = passengerDetails;
    entityDeparture.transactionFlight = transactionFlight;
    entityDeparture.flightReference = transactionFlight.flightReference;
    entityDeparture.providerReference =
      transactionFlight.prebookingFlight.providerReference;
    entityDeparture.sequence = 1;

    const entityReturn = structuredClone(entityDeparture);
    entityReturn.departureDate = requestDto.returnDate;
    entityReturn.origin = requestDto.destination;
    entityReturn.destination = origin;
    entityReturn.sequence = 2;

    return { entityDeparture, entityReturn };
  }
}

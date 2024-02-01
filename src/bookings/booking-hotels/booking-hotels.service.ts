import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { HotelProvider } from '../../common/enums/hotel-provider.enum';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CustomerHotelDetailsService } from '../../customer-details/hotels/customer-hotel-details.service';
import { PaymentHotel } from '../../payments/payment-hotels/payment-hotel.entity';
import { PaymentHotelsService } from '../../payments/payment-hotels/payment-hotels.service';
import { TransactionHotelsService } from '../../transactions/hotels/transaction-hotels.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { BookingHotelProcessesService } from '../booking-hotel-processes/booking-hotel-processes.service';
import { BookingHotel } from './booking-hotel.entity';
import { BookingHotelsRepository } from './booking-hotels.repository';
import { CreateBookingHotelRequestDto } from './dtos/request/create-booking-hotel-request.dto';
import { UpdateBookingHotelRequestDto } from './dtos/request/update-booking-hotel-request.dto';

@Injectable()
export class BookingHotelsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly bookingHotelsRepository: BookingHotelsRepository,
    private readonly paymentHotelsService: PaymentHotelsService,
    private readonly transactionHotelsService: TransactionHotelsService,
    private readonly customerHotelDetailsService: CustomerHotelDetailsService,
    private readonly bookingHotelProcessesService: BookingHotelProcessesService,
  ) {}

  async create(requestDto: CreateBookingHotelRequestDto) {
    this.loggerService.log('create...');

    const {
      transactionId,
      customerDetail,
      paymentHotelDetail,
      rooms,
      provider,
      providerDetails,
    } = requestDto;

    const [transactionHotel, paymentHotel] = await Promise.all([
      this.transactionHotelsService.fetchByTransactionId(transactionId),
      this.paymentHotelsService
        .fetchByReferenceNumber(paymentHotelDetail.referenceNumber)
        .catch((err) => err),
    ]);

    if (provider === HotelProvider.Tbo) {
      if (
        transactionHotel.prebookingHotel.tboHotelPrebookResponses.length !==
        rooms
      )
        this.errorHandlerService.conflictException(
          'Rooms and transactionHotel.prebookingHotel.tboHotelPrebookResponses.length are not equal',
        );
      if (+providerDetails.Rooms?.length !== rooms)
        this.errorHandlerService.conflictException(
          'Rooms and providerDetails.Rooms are not equal',
        );
    }

    if (transactionHotel.bookingHotels.length !== 0)
      this.errorHandlerService.internalServerErrorException(
        'Transaction already booked!',
      );
    if (paymentHotel)
      if (paymentHotel instanceof PaymentHotel)
        this.errorHandlerService.internalServerErrorException(
          'PaymentHotel: referenceNumber already exists',
        );

    const [newCustomerHotelDetail, newPaymentHotel] = await Promise.all([
      this.customerHotelDetailsService.create(customerDetail),
      this.paymentHotelsService.create(paymentHotelDetail),
    ]);

    const entity = this.classMapper.map(
      requestDto,
      CreateBookingHotelRequestDto,
      BookingHotel,
    );
    entity.userId = this.request.user?.id ?? null;
    entity.customerHotelDetail = newCustomerHotelDetail;
    entity.providerReference =
      transactionHotel.prebookingHotel.providerReference;

    const entitiesNew = await Promise.all(
      [...Array(rooms).keys()].map(() =>
        this.bookingHotelsRepository.create(structuredClone(entity)),
      ),
    );

    const updateTransactionFlightRequestDto =
      await this.bookingHotelProcessesService.processHotelBooking(provider, {
        providerDetails: requestDto.providerDetails,
        bookingHotels: entitiesNew,
        paymentHotel: newPaymentHotel,
        transactionHotelId: transactionHotel.id,
        providerReference: transactionHotel.prebookingHotel.providerReference,
      });

    const { bookingHotels } = await this.transactionHotelsService.update(
      updateTransactionFlightRequestDto,
    );

    return bookingHotels;
  }

  async fetchAll(): Promise<BookingHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<BookingHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.bookingHotelsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.bookingHotelsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.bookingHotelsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');
    return entity;
  }

  async update(requestDto: UpdateBookingHotelRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateBookingHotelRequestDto,
      BookingHotel,
    );

    return await this.bookingHotelsRepository.update(entity);
  }

  async fetchByIdWithUserId(id: number, userId: string) {
    this.loggerService.log('fetchByIdWithUserId...');

    const entity = await this.bookingHotelsRepository.fetchByIdWithUserId(
      id,
      userId,
    );
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async updateWithUserId(requestDto: UpdateBookingHotelRequestDto) {
    this.loggerService.log('update...');

    await this.fetchByIdWithUserId(requestDto.id, requestDto.userId);

    const entity = this.classMapper.map(
      requestDto,
      UpdateBookingHotelRequestDto,
      BookingHotel,
    );

    return await this.bookingHotelsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.bookingHotelsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}

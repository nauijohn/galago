import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateTransactionFlightRequestDto } from './dtos/request/create-transaction-flight-request.dto';
import { UpdateTransactionFlightRequestDto } from './dtos/request/update-transaction-flight-request.dto';
import { TransactionFlight } from './transaction-flight.entity';
import { TransactionFlightsRepository } from './transaction-flights.repository';

@Injectable()
export class TransactionFlightsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly transactionFlightsRepository: TransactionFlightsRepository,
  ) {}

  async create(requestDto: CreateTransactionFlightRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateTransactionFlightRequestDto,
      TransactionFlight,
    );
    entity.userId = this.request.user?.id ?? null;
    entity.transactionId = `GLGF${new Date().getTime()}`;

    return await this.transactionFlightsRepository.create(entity);
  }

  async fetchAll(): Promise<TransactionFlight[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<TransactionFlight[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.transactionFlightsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.transactionFlightsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.transactionFlightsRepository.fetchById(id);
    if (!entity)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: id not found',
      );

    return entity;
  }

  async fetchByPaymentReferenceNumber(paymentReferenceNumber: string) {
    this.loggerService.log('fetchByPaymentReferenceNumber...');

    const entity =
      await this.transactionFlightsRepository.fetchByPaymentReferenceNumber(
        paymentReferenceNumber,
      );
    if (!entity)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: paymentReferenceNumber not found',
      );

    return entity;
  }

  async fetchByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentId...');

    const entity =
      await this.transactionFlightsRepository.fetchByPaymentIntentId(
        paymentIntentId,
      );
    if (!entity)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: paymentIntentId not found',
      );

    return entity;
  }

  async fetchByPaymentIntentIdWithoutUserId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentIdWithoutUserId...');

    const entity =
      await this.transactionFlightsRepository.fetchByPaymentIntentIdWithoutUserId(
        paymentIntentId,
      );
    if (!entity)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: paymentIntentId not found',
      );

    return entity;
  }

  async update(requestDto: UpdateTransactionFlightRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateTransactionFlightRequestDto,
      TransactionFlight,
    );

    return await this.transactionFlightsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.transactionFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByTransactionId(transactionId: string) {
    this.loggerService.log('fetchByTransactionId...');

    const entity = await this.transactionFlightsRepository.fetchByTransactionId(
      transactionId,
    );
    if (!entity) this.errorHandlerService.notFoundException('Id not found');
    return entity;
  }

  async updateBookingHotel(transactionFlight: TransactionFlight) {
    this.loggerService.log('updateBookingHotel...');

    return await this.transactionFlightsRepository.update(transactionFlight);
  }
}

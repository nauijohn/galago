import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateTransactionHotelRequestDto } from './dtos/request/create-transaction-hotel-request.dto';
import { UpdateTransactionHotelRequestDto } from './dtos/request/update-transaction-hotel-request.dto';
import { TransactionHotel } from './transaction-hotel.entity';
import { TransactionHotelsRepository } from './transaction-hotels.repository';

@Injectable()
export class TransactionHotelsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly transactionHotelsRepository: TransactionHotelsRepository,
  ) {}

  async create(requestDto: CreateTransactionHotelRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateTransactionHotelRequestDto,
      TransactionHotel,
    );
    entity.userId = this.request.user?.id ?? null;
    entity.transactionId = `GLGH${new Date().getTime()}`;

    return await this.transactionHotelsRepository.create(entity);
  }

  async fetchAll(): Promise<TransactionHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<TransactionHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.transactionHotelsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.transactionHotelsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.transactionHotelsRepository.fetchById(id);
    if (!entity)
      this.errorHandlerService.notFoundException(
        'TransactionHotel: Id not found',
      );

    return entity;
  }

  async fetchByPaymentIntentIdWithoutUserId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentIdWithoutUserId...');

    const entity =
      await this.transactionHotelsRepository.fetchByPaymentIntentIdWithoutUserId(
        paymentIntentId,
      );
    if (!entity)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: paymentIntentId not found',
      );

    return entity;
  }

  async update(requestDto: UpdateTransactionHotelRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateTransactionHotelRequestDto,
      TransactionHotel,
    );

    return await this.transactionHotelsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    return (await this.transactionHotelsRepository.deleteById(id))
      ? 'Delete successful!'
      : this.errorHandlerService.internalServerErrorException('Delete failed!');
  }

  async fetchByTransactionId(transactionId: string) {
    this.loggerService.log('fetchByTransactionId...');

    const entity = await this.transactionHotelsRepository.fetchByTransactionId(
      transactionId,
    );
    if (!entity)
      this.errorHandlerService.notFoundException(
        'TransactionHotel: Id not found',
      );
    return entity;
  }

  async updateBookingHotel(transactionHotel: TransactionHotel) {
    this.loggerService.log('updateBookingHotel...');
    return await this.transactionHotelsRepository.update(transactionHotel);
  }
}

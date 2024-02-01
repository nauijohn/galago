import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PaymentStatus } from '../payment-status.enum';
import { CreatePaymentHotelsRequestDto } from './dtos/request/create-payment-hotels-request.dto';
import { UpdatePaymentHotelsRequestDto } from './dtos/request/update-payment-hotels-request.dto';
import { PaymentHotel } from './payment-hotel.entity';
import { PaymentHotelsRepository } from './payment-hotels.repository';

@Injectable()
export class PaymentHotelsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly paymentHotelsRepository: PaymentHotelsRepository,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async create(requestDto: CreatePaymentHotelsRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreatePaymentHotelsRequestDto,
      PaymentHotel,
    );
    entity.userId = this.request.user.id;
    entity.status = PaymentStatus.Pending;

    return await this.paymentHotelsRepository.create(entity);
  }

  async fetchAll(): Promise<PaymentHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PaymentHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.paymentHotelsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.paymentHotelsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const entity = await this.paymentHotelsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdatePaymentHotelsRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdatePaymentHotelsRequestDto,
      PaymentHotel,
    );

    return await this.paymentHotelsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.paymentHotelsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async findPaymentIntentById(id: string) {
    this.loggerService.log('findPaymentIntentById...');
    return await this.paymentHotelsRepository.findPaymentIntentById(id);
  }

  async updateStatusToPaidByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('updateStatusToPaidByPaymentIntentId...');
    return await this.paymentHotelsRepository.updateStatusToPaidByPaymentIntentId(
      paymentIntentId,
    );
  }

  async fetchByReferenceNumber(referenceNumber: string) {
    this.loggerService.log('fetchByReferenceNumber...');
    const entity = await this.paymentHotelsRepository.fetchByReferenceNumber(
      referenceNumber,
    );
    if (!entity)
      this.errorHandlerService.notFoundException(
        'PaymentHotels: referenceNumber not found!',
      );
    return entity;
  }
}

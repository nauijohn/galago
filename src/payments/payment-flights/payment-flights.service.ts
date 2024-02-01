import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { PromoCodesService } from '../../promo-codes/promo-codes.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { SecurityService } from '../../utils/security.service';
import { PaymentStatus } from '../payment-status.enum';
import { CreatePaymentFlightRequestDto } from './dtos/request/create-payment-flight-request.dto';
import { UpdatePaymentFlightRequestDto } from './dtos/request/update-payment-flight-request.dto';
import { PaymentFlight } from './payment-flight.entity';
import { PaymentFlightsRepository } from './payment-flights.repository';

@Injectable()
export class PaymentFlightsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly paymentFlightsRepository: PaymentFlightsRepository,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    @Inject(forwardRef(() => PromoCodesService))
    private readonly promoCodesService: PromoCodesService,
    private readonly securityService: SecurityService,
  ) {}

  async create(requestDto: CreatePaymentFlightRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreatePaymentFlightRequestDto,
      PaymentFlight,
    );
    entity.userId = this.request.user?.id ?? null;
    entity.status = PaymentStatus.Pending;

    await this.promoCodesService.applyPromo<PaymentFlight>(entity);

    return await this.paymentFlightsRepository.create(entity);
  }

  async fetchAll(): Promise<PaymentFlight[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PaymentFlight[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.paymentFlightsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.paymentFlightsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.paymentFlightsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async fetchAllByPromoCode(promoCode: string) {
    this.loggerService.log('fetchAllByPromoCode...');
    return await this.paymentFlightsRepository.fetchAllByPromoCode(promoCode);
  }

  async countByPromoCode(promoCode: string) {
    this.loggerService.log('countByPromoCode...');
    return await this.paymentFlightsRepository.countByPromoCode(promoCode);
  }

  async update(requestDto: UpdatePaymentFlightRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdatePaymentFlightRequestDto,
      PaymentFlight,
    );

    return await this.paymentFlightsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.paymentFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async findPaymentIntentById(id: string) {
    this.loggerService.log('findPaymentIntentById...');
    return await this.paymentFlightsRepository.findPaymentIntentById(id);
  }

  async updateStatusToPaidByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('updateStatusToPaidByPaymentIntentId...');
    return await this.paymentFlightsRepository.updateStatusToPaidByPaymentIntentId(
      paymentIntentId,
    );
  }

  async fetchByReferenceNumber(referenceNumber: string) {
    this.loggerService.log('fetchByReferenceNumber...');

    const decryptedReferenceNumber =
      await this.securityService.decryptWordForURL(referenceNumber);

    const entity = await this.paymentFlightsRepository.fetchByReferenceNumber(
      decryptedReferenceNumber,
    );
    if (!entity)
      this.errorHandlerService.notFoundException(
        'PaymentFlights: referenceNumber not found!',
      );
    return entity;
  }
}

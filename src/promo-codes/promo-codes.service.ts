import * as moment from 'moment';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '../common/dtos/request/pagination-query.dto';
import { PaymentFlight } from '../payments/payment-flights/payment-flight.entity';
import { PaymentFlightsService } from '../payments/payment-flights/payment-flights.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreatePromoCodeRequestDto } from './dtos/request/create-promo-code-request.dto';
import { UpdatePromoCodeRequestDto } from './dtos/request/update-promo-code-request.dto';
import { PromoCode } from './promo-code.entity';
import { PromoCodesRepository } from './promo-codes.repository';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectMapper()
    private readonly classMapper: Mapper,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly promoCodesRepository: PromoCodesRepository,
    @Inject(forwardRef(() => PaymentFlightsService))
    private readonly paymentFlightsService: PaymentFlightsService,
  ) {}

  async create(requestDto: CreatePromoCodeRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreatePromoCodeRequestDto,
      PromoCode,
    );

    return await this.promoCodesRepository.create(entity);
  }

  async fetchAll(): Promise<PromoCode[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PromoCode[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.promoCodesRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.promoCodesRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.promoCodesRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async fetchByPromoCode(promoCode: string) {
    this.loggerService.log('fetchByPromoCode...');
    const entity = await this.promoCodesRepository.fetchByPromoCode(promoCode);
    if (!entity)
      this.errorHandlerService.notFoundException('PromoCode not found');
    return entity;
  }

  async fetchByPromoCodeForFlights(promoCode: string) {
    this.loggerService.log('fetchByPromoCodeForFlights...');
    const entity = await this.promoCodesRepository.fetchByPromoCodeForFlights(
      promoCode,
    );
    if (!entity)
      this.errorHandlerService.notFoundException('PromoCode not found');
    return entity;
  }

  async update(requestDto: UpdatePromoCodeRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdatePromoCodeRequestDto,
      PromoCode,
    );

    return await this.promoCodesRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.promoCodesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  private isPromoCodeStillValid(promoCode: PromoCode) {
    return (
      moment(promoCode.fromDate).isBefore(moment()) &&
      moment(promoCode.toDate).isAfter(moment())
    );
  }

  private isPromoCodeEnabled(promoCode: PromoCode) {
    return promoCode.isEnabled;
  }

  public async applyPromo<T>(entity: T) {
    if (entity instanceof PaymentFlight) {
      const promoCodes: PromoCode[] = (
        await Promise.all(
          entity.promoCodes?.map((promoCode) =>
            this.fetchByPromoCodeForFlights(promoCode).catch((err) => err),
          ),
        )
      ).filter(
        (promoCode) =>
          promoCode instanceof PromoCode &&
          this.isPromoCodeStillValid(promoCode) &&
          this.isPromoCodeEnabled(promoCode),
      );

      let discountAmount = 0;
      entity.paidAmount = entity.originalAmount;
      entity.discountAmount = discountAmount;
      if (promoCodes.length === 1)
        discountAmount = await this.summateDiscount(
          promoCodes,
          entity.paidAmount,
        );

      if (promoCodes.length > 1) {
        const areAllMultipleAllowed = promoCodes.every(
          (promoCode) => promoCode.isMultipleAllowed === true,
        );
        if (areAllMultipleAllowed)
          discountAmount = await this.summateDiscount(
            promoCodes,
            entity.paidAmount,
          );
      }
      entity.paidAmount = entity.originalAmount - discountAmount;
      entity.discountAmount = discountAmount;
    }
  }

  private isDiscountExceedsValueCap(promoCode: PromoCode, discount: number) {
    return discount >= promoCode.valueCap;
  }

  private isPromoCodeApplicableByMinValue(
    promoCode: PromoCode,
    amount: number,
  ) {
    return amount >= promoCode.minValueApplied;
  }

  private async summateDiscount(
    promoCodes: PromoCode[],
    originalAmount: number,
  ) {
    return (
      await this.mapDiscountPerPromoCode(promoCodes, originalAmount)
    ).reduce((acc, curr) => curr + acc, 0);
  }

  private async mapDiscountPerPromoCode(
    promoCodes: PromoCode[],
    originalAmount: number,
  ) {
    let amount = originalAmount;
    return await Promise.all(
      promoCodes.map(async (promoCode) => {
        const discount = await this.determineDiscount(promoCode, amount);
        amount -= discount;
        return discount;
      }),
    );
  }

  private async determineDiscount(promoCode: PromoCode, amount: number) {
    let discount = 0;

    if (!(await this.isPromoCodeUseValid(promoCode))) return discount;
    if (!this.isPromoCodeApplicableByMinValue(promoCode, amount))
      return discount;

    switch (promoCode.priceMargin) {
      case 'fixed':
        discount = promoCode.fixedAmount;
      case 'percentage':
        discount = amount * promoCode.percentage;
    }
    if (this.isDiscountExceedsValueCap(promoCode, discount))
      discount = promoCode.valueCap;

    return discount;
  }

  private async isPromoCodeUseValid(promoCode: PromoCode) {
    const { maxUse } = promoCode;
    if (!maxUse) return true;
    const count = await this.paymentFlightsService.countByPromoCode(
      promoCode.promoCode,
    );
    if (maxUse > count) return true;
    return false;
  }
}

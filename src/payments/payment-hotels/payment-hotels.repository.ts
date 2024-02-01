import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PaymentStatus } from '../payment-status.enum';
import { PaymentHotel } from './payment-hotel.entity';

@Injectable()
export class PaymentHotelsRepository
  implements GenericRepository<PaymentHotel>
{
  constructor(
    @InjectRepository(PaymentHotel)
    private readonly repository: Repository<PaymentHotel>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: PaymentHotel) {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<PaymentHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PaymentHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    switch (arguments.length) {
      case 0:
        return await this.repository.find({
          where: { userId: this.request.user.id },
        });
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const { page, limit, order } = queryDto;
          return await this.repository.find({
            where: { userId: this.request.user.id },
            order: { id: order },
            take: limit,
            skip: limit * (page - 1),
          });
        }
    }
  }

  async fetchById(id: number): Promise<PaymentHotel> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user.id,
      id,
    });
  }

  async update(entity: PaymentHotel) {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async findPaymentIntentById(paymentIntentId: string) {
    this.loggerService.log('findPaymentIntentById...');
    paymentIntentId = paymentIntentId ?? '';
    return await this.repository.findOneBy({
      paymentIntentId,
    });
  }

  async updateStatusToPaidByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('updateStatusToPaidByPaymentIntentId...');
    const { affected } = await this.repository.update(
      { paymentIntentId },
      {
        status: PaymentStatus.Paid,
      },
    );
    if (affected === 1) return true;
    return false;
  }

  async fetchByReferenceNumber(referenceNumber: string) {
    this.loggerService.log('fetchByReferenceNumber...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      referenceNumber,
    });
  }
}

import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { TransactionFlight } from './transaction-flight.entity';

@Injectable()
export class TransactionFlightsRepository
  implements GenericRepository<TransactionFlight>
{
  constructor(
    @InjectRepository(TransactionFlight)
    private readonly repository: Repository<TransactionFlight>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: TransactionFlight): Promise<TransactionFlight> {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<TransactionFlight[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<TransactionFlight[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    switch (arguments.length) {
      case 0:
        return await this.repository.find({
          where: { userId: this.request.user?.id ?? null },
          relations: {
            prebookingFlight: true,
            bookingFlights: true,
          },
        });
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const { page, limit, order } = queryDto;
          return await this.repository.find({
            where: { userId: this.request.user?.id ?? null },
            relations: {
              prebookingFlight: true,
              bookingFlights: true,
            },
            order: { id: order },
            take: limit,
            skip: limit * (page - 1),
          });
        }
    }
  }

  async fetchById(id: number): Promise<TransactionFlight> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      id,
    });
  }

  async update(entity: TransactionFlight): Promise<TransactionFlight> {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByTransactionId(
    transactionId: string,
  ): Promise<TransactionFlight> {
    this.loggerService.log('fetchByTransactionId...');
    transactionId = transactionId ?? '';
    return await this.repository.findOne({
      where: {
        userId: this.request.user?.id ?? null,
        transactionId,
      },
      relations: {
        prebookingFlight: true,
      },
    });
  }

  async fetchByPaymentReferenceNumber(paymentReferenceNumber: string) {
    this.loggerService.log('fetchByPaymentReferenceNumber...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      paymentFlight: {
        referenceNumber: paymentReferenceNumber,
      },
    });
  }

  async fetchByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentId...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      paymentFlight: {
        paymentIntentId,
      },
    });
  }

  async fetchByPaymentIntentIdWithoutUserId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentIdWithoutUserId...');
    return await this.repository.findOneBy({
      paymentFlight: {
        paymentIntentId,
      },
    });
  }
}

import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { TransactionHotel } from './transaction-hotel.entity';

@Injectable()
export class TransactionHotelsRepository
  implements GenericRepository<TransactionHotel>
{
  constructor(
    @InjectRepository(TransactionHotel)
    private readonly repository: Repository<TransactionHotel>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: TransactionHotel): Promise<TransactionHotel> {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<TransactionHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<TransactionHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    switch (arguments.length) {
      case 0:
        return await this.repository.find({
          where: { userId: this.request.user?.id ?? null },
          relations: {
            prebookingHotel: true,
            bookingHotels: true,
          },
        });
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const { page, limit, order } = queryDto;
          return await this.repository.find({
            where: { userId: this.request.user?.id ?? null },
            relations: {
              prebookingHotel: true,
              bookingHotels: true,
            },
            order: { id: order },
            take: limit,
            skip: limit * (page - 1),
          });
        }
    }
  }

  async fetchById(id: number): Promise<TransactionHotel> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOne({
      where: {
        userId: this.request.user?.id ?? null,
        id,
      },
      relations: {
        bookingHotels: true,
        paymentHotel: true,
      },
    });
  }

  async update(entity: TransactionHotel): Promise<TransactionHotel> {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByTransactionId(transactionId: string): Promise<TransactionHotel> {
    this.loggerService.log('fetchByTransactionId...');
    transactionId = transactionId ?? '';
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      transactionId,
    });
  }

  async fetchByPaymentIntentIdWithoutUserId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentIdWithoutUserId...');
    return await this.repository.findOneBy({
      paymentHotel: {
        paymentIntentId,
      },
    });
  }
}

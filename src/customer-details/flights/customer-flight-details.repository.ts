import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CustomerFlightDetail } from './customer-flight-detail.entity';

@Injectable()
export class CustomerFlightDetailsRepository
  implements GenericRepository<CustomerFlightDetail>
{
  constructor(
    private readonly loggerService: MyLoggerService,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    @InjectRepository(CustomerFlightDetail)
    private readonly repository: Repository<CustomerFlightDetail>,
  ) {}

  async create(entity: CustomerFlightDetail): Promise<CustomerFlightDetail> {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<CustomerFlightDetail[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<CustomerFlightDetail[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    switch (arguments.length) {
      case 0:
        return await this.repository.find({
          where: {
            userId: this.request.user?.id ?? null,
          },
        });
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const { page, limit, order } = queryDto;
          return await this.repository.find({
            where: {
              userId: this.request.user?.id ?? null,
            },
            order: { id: order },
            take: limit,
            skip: limit * (page - 1),
          });
        }
    }
  }

  async fetchById(id: number): Promise<CustomerFlightDetail> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      id,
    });
  }

  async update(entity: CustomerFlightDetail): Promise<CustomerFlightDetail> {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByAllDetails(
    entity: CustomerFlightDetail,
  ): Promise<CustomerFlightDetail> {
    this.loggerService.log('fetchByAllDetails...');
    const { email, name, mobileNumber } = entity;

    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      email,
      name,
      mobileNumber,
    });
  }
}

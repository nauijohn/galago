import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PricingHotel } from './pricing-hotel.entity';

@Injectable()
export class PricingHotelsRepository
  implements GenericRepository<PricingHotel>
{
  constructor(
    @InjectRepository(PricingHotel)
    private readonly repository: Repository<PricingHotel>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: PricingHotel): Promise<PricingHotel> {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<PricingHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PricingHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    switch (arguments.length) {
      case 0:
        return await this.repository.find();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const { page, limit, order } = queryDto;
          return await this.repository.find({
            order: { id: order },
            take: limit,
            skip: limit * (page - 1),
          });
        }
    }
  }

  async fetchById(id: number): Promise<PricingHotel> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({ id });
  }

  async update(entity: PricingHotel): Promise<PricingHotel> {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }
}

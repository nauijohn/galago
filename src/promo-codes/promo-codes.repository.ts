import { FindOptionsOrderValue, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../utils/my-logger.service';
import { PromoCode } from './promo-code.entity';

export class Itest {
  '0': number;
  '1': number;
  '2': FindOptionsOrderValue;
}

@Injectable()
export class PromoCodesRepository implements GenericRepository<PromoCode> {
  constructor(
    @InjectRepository(PromoCode)
    private readonly repository: Repository<PromoCode>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: PromoCode) {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<PromoCode[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PromoCode[]>;

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

  async fetchById(id: number): Promise<PromoCode> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      id,
    });
  }

  async fetchByPromoCode(promoCode: string): Promise<PromoCode> {
    this.loggerService.log('fetchByPromoCode...');
    return await this.repository.findOneBy({ promoCode });
  }

  async fetchByPromoCodeForFlights(promoCode: string): Promise<PromoCode> {
    this.loggerService.log('fetchByPromoCode...');
    return await this.repository.findOneBy({ promoCode, type: 'flights' });
  }

  async update(entity: PromoCode) {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }
}

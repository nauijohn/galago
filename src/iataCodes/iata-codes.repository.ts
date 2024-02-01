import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../common/dtos/request/pagination-query.dto';
import { CabinClass } from '../pricings/flights/cabin-class.enum';
import { MyLoggerService } from '../utils/my-logger.service';
import { IataCode } from './iata-code.entity';

@Injectable()
export class IataCodesRepository implements GenericRepository<IataCode> {
  constructor(
    @InjectRepository(IataCode)
    private readonly repository: Repository<IataCode>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: IataCode): Promise<IataCode> {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<IataCode[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<IataCode[]>;

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

  async fetchById(id: number): Promise<IataCode> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({ id });
  }

  async update(entity: IataCode): Promise<IataCode> {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByIdAndCabinClass(id: number, cabinClass: CabinClass) {
    this.loggerService.log('fetchByIdAndCabinClass...');

    return await this.repository.findOneBy({
      id,
      pricingFlights: { cabinClass },
    });
  }
}

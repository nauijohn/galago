import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { IataCode } from '../../iataCodes/iata-code.entity';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PricingFlight } from './pricing-flight.entity';

@Injectable()
export class PricingFlightsRepository
  implements GenericRepository<PricingFlight>
{
  constructor(
    @InjectRepository(PricingFlight)
    private readonly repository: Repository<PricingFlight>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: PricingFlight): Promise<PricingFlight> {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<PricingFlight[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PricingFlight[]>;

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

  async fetchById(id: number): Promise<PricingFlight> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({ id });
  }

  async update(entity: PricingFlight): Promise<PricingFlight> {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByIataCode(iataCode: IataCode): Promise<PricingFlight[]> {
    this.loggerService.log('fetchByIataCode...');
    return await this.repository.findBy({ iataCode });
  }
}

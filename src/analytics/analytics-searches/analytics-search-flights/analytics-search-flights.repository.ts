import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepositoryMongo } from '../../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { TYPEORM_MONGODB } from '../../../config/config.constant';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { AnalyticsSearchFlight } from './analytics-search-flight.mongo-entity';

@Injectable()
export class AnalyticsSearchFlightsRepository
  implements GenericRepositoryMongo<AnalyticsSearchFlight>
{
  constructor(
    @InjectRepository(AnalyticsSearchFlight, TYPEORM_MONGODB)
    private readonly repository: Repository<AnalyticsSearchFlight>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: AnalyticsSearchFlight): Promise<AnalyticsSearchFlight> {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<AnalyticsSearchFlight[]>;
  async fetchAll(
    queryDto: PaginationQueryDto,
  ): Promise<AnalyticsSearchFlight[]>;

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

  async fetchById(id: string): Promise<AnalyticsSearchFlight> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({ id });
  }

  async update(entity: AnalyticsSearchFlight): Promise<AnalyticsSearchFlight> {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: string): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }
}

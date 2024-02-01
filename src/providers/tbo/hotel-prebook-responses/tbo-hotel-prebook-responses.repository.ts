import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { TboHotelPrebookResponse } from './tbo-hotel-prebook-response.entity';

@Injectable()
export class TboHotelPrebookResponsesRepository
  implements GenericRepository<TboHotelPrebookResponse>
{
  constructor(
    @InjectRepository(TboHotelPrebookResponse)
    private readonly repository: Repository<TboHotelPrebookResponse>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: TboHotelPrebookResponse) {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<TboHotelPrebookResponse[]>;
  async fetchAll(
    queryDto: PaginationQueryDto,
  ): Promise<TboHotelPrebookResponse[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    switch (arguments.length) {
      case 0:
        return await this.repository.find({
          where: { userId: this.request.user?.id ?? null },
        });
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const { page, limit, order } = queryDto;
          return await this.repository.find({
            where: { userId: this.request.user?.id ?? null },
            order: { id: order },
            take: limit,
            skip: limit * (page - 1),
          });
        }
    }
  }

  async fetchById(id: number): Promise<TboHotelPrebookResponse> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      id,
    });
  }

  async update(entity: TboHotelPrebookResponse) {
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

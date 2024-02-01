import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { BookingFlight } from './booking-flight.entity';

@Injectable()
export class BookingFlightsRepository
  implements GenericRepository<BookingFlight>
{
  constructor(
    private readonly loggerService: MyLoggerService,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    @InjectRepository(BookingFlight)
    private readonly repository: Repository<BookingFlight>,
  ) {}

  async create(entity: BookingFlight): Promise<BookingFlight> {
    this.loggerService.log('create...');
    console.log('entity: ', entity);
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<BookingFlight[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<BookingFlight[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    switch (arguments.length) {
      case 0:
        return await this.repository.find({
          where: { userId: this.request.user?.id ?? null },
          relations: {
            passengerDetails: true,
            customerFlightDetail: true,
          },
        });
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const { page, limit, order } = queryDto;
          return await this.repository.find({
            where: { userId: this.request.user?.id ?? null },
            relations: {
              passengerDetails: true,
              customerFlightDetail: true,
            },
            order: { id: order },
            take: limit,
            skip: limit * (page - 1),
          });
        }
    }
  }

  async fetchById(id: number): Promise<BookingFlight> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOne({
      where: {
        userId: this.request.user?.id ?? null,
        id,
      },
      relations: {
        passengerDetails: true,
        mystiflyFlightDetail: true,
      },
    });
  }

  async update(entity: BookingFlight): Promise<BookingFlight> {
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

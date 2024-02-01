import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { BookingHotel } from './booking-hotel.entity';

@Injectable()
export class BookingHotelsRepository
  implements GenericRepository<BookingHotel>
{
  constructor(
    private readonly loggerService: MyLoggerService,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    @InjectRepository(BookingHotel)
    private readonly repository: Repository<BookingHotel>,
  ) {}

  async create(entity: BookingHotel): Promise<BookingHotel> {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<BookingHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<BookingHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    switch (arguments.length) {
      case 0:
        return await this.repository.find({
          where: { userId: this.request.user.id },
          relations: {
            tboHotelDetail: true,
            tboHotelBookResponse: true,
          },
        });
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const { page, limit, order } = queryDto;
          return await this.repository.find({
            where: { userId: this.request.user.id },
            relations: {
              tboHotelDetail: true,
              tboHotelBookResponse: true,
            },
            order: { id: order },
            take: limit,
            skip: limit * (page - 1),
          });
        }
    }
  }

  async fetchById(id: number): Promise<BookingHotel> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOne({
      where: {
        userId: this.request.user?.id ?? null,
        id,
      },
      relations: {
        tboHotelDetail: true,
        tboHotelBookResponse: true,
      },
    });
  }

  async fetchByIdWithUserId(id: number, userId: string): Promise<BookingHotel> {
    this.loggerService.log('fetchByIdWithUserId...');
    return await this.repository.findOne({
      where: { id, userId },
      relations: { tboHotelDetail: true },
    });
  }

  async update(entity: BookingHotel): Promise<BookingHotel> {
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

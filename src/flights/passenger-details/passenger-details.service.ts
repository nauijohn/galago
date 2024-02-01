import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreatePassengerDetailRequestDto } from './dtos/request/create-passenger-detail-request.dto';
import { UpdatePassengerDetailRequestDto } from './dtos/request/update-passenger-detail-request.dto';
import { PassengerDetail } from './passenger-detail.entity';
import { PassengerDetailsRepository } from './passenger-details.repository';

@Injectable()
export class PassengerDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly passengerDetailsRepository: PassengerDetailsRepository,
  ) {}

  async create(requestDto: CreatePassengerDetailRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreatePassengerDetailRequestDto,
      PassengerDetail,
    );
    entity.userId = this.request.user?.id ?? null;

    return await this.passengerDetailsRepository.create(entity);
  }

  async fetchAll(): Promise<PassengerDetail[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PassengerDetail[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.passengerDetailsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.passengerDetailsRepository.fetchAll(queryDto);
    }
  }

  async fetchAllByBookingFlightsId(bookingFlightsId: number) {
    this.loggerService.log('fetchAllByBookingFlightsId...');
    return await this.passengerDetailsRepository.fetchAllByBookingFlightsId(
      bookingFlightsId,
    );
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.passengerDetailsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdatePassengerDetailRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdatePassengerDetailRequestDto,
      PassengerDetail,
    );

    return await this.passengerDetailsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.passengerDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}

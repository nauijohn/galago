import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CustomerHotelDetail } from './customer-hotel-detail.entity';
import { CustomerHotelDetailsRepository } from './customer-hotel-details.repository';
import { CreateCustomerHotelDetailRequestDto } from './dtos/request/create-customer-hotel-detail-request.dto';
import { UpdateCustomerHotelDetailRequestDto } from './dtos/request/update-customer-hotel-detail-request.dto';

@Injectable()
export class CustomerHotelDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly customerHotelDetailsRepository: CustomerHotelDetailsRepository,
  ) {}

  async create(requestDto: CreateCustomerHotelDetailRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateCustomerHotelDetailRequestDto,
      CustomerHotelDetail,
    );
    entity.userId = this.request.user?.id ?? null;

    const entityDB =
      await this.customerHotelDetailsRepository.fetchByAllDetails(entity);

    if (!entityDB)
      return await this.customerHotelDetailsRepository.create(entity);
    return entityDB;
  }

  async fetchAll(): Promise<CustomerHotelDetail[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<CustomerHotelDetail[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.customerHotelDetailsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.customerHotelDetailsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.customerHotelDetailsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');
    return entity;
  }

  async update(requestDto: UpdateCustomerHotelDetailRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateCustomerHotelDetailRequestDto,
      CustomerHotelDetail,
    );

    return await this.customerHotelDetailsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.customerHotelDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByAllDetails(requestDto: CreateCustomerHotelDetailRequestDto) {
    this.loggerService.log('fetchByAllDetails...');

    const entity = this.classMapper.map(
      requestDto,
      CreateCustomerHotelDetailRequestDto,
      CustomerHotelDetail,
    );

    return await this.customerHotelDetailsRepository.fetchByAllDetails(entity);
  }
}

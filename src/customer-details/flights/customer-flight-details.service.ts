import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CustomerFlightDetail } from './customer-flight-detail.entity';
import { CustomerFlightDetailsRepository } from './customer-flight-details.repository';
import { CreateCustomerFlightDetailRequestDto } from './dtos/request/create-customer-flight-detail-request.dto';
import { UpdateCustomerFlightDetailRequestDto } from './dtos/request/update-customer-flight-detail-request.dto';

@Injectable()
export class CustomerFlightDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly customerFlightDetailsRepository: CustomerFlightDetailsRepository,
  ) {}

  async create(requestDto: CreateCustomerFlightDetailRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateCustomerFlightDetailRequestDto,
      CustomerFlightDetail,
    );
    entity.userId = this.request.user?.id ?? null;

    const entityDB =
      await this.customerFlightDetailsRepository.fetchByAllDetails(entity);

    if (!entityDB)
      return await this.customerFlightDetailsRepository.create(entity);

    return entityDB;
  }

  async fetchAll(): Promise<CustomerFlightDetail[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<CustomerFlightDetail[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.customerFlightDetailsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.customerFlightDetailsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.customerFlightDetailsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');
    return entity;
  }

  async update(requestDto: UpdateCustomerFlightDetailRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateCustomerFlightDetailRequestDto,
      CustomerFlightDetail,
    );

    return await this.customerFlightDetailsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.customerFlightDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByAllDetails(requestDto: CreateCustomerFlightDetailRequestDto) {
    this.loggerService.log('fetchByAllDetails...');

    const entity = this.classMapper.map(
      requestDto,
      CreateCustomerFlightDetailRequestDto,
      CustomerFlightDetail,
    );

    return await this.customerFlightDetailsRepository.fetchByAllDetails(entity);
  }
}

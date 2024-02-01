import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '../common/dtos/request/pagination-query.dto';
import { CabinClass } from '../pricings/flights/cabin-class.enum';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreateIataCodeRequestDto } from './dtos/request/create-iata-code-request.dto';
import { UpdateIataCodeRequestDto } from './dtos/request/update-iata-code-request.dto';
import { IataCode } from './iata-code.entity';
import { IataCodesRepository } from './iata-codes.repository';

@Injectable()
export class IataCodesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly iataCodesRepository: IataCodesRepository,
  ) {}

  async create(requestDto: CreateIataCodeRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateIataCodeRequestDto,
      IataCode,
    );
    return await this.iataCodesRepository.create(entity);
  }

  async fetchAll(): Promise<IataCode[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<IataCode[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.iataCodesRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.iataCodesRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const entity = await this.iataCodesRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateIataCodeRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateIataCodeRequestDto,
      IataCode,
    );

    return await this.iataCodesRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.iataCodesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByIdAndCabinClass(id: number, cabinClass: CabinClass) {
    this.loggerService.log('fetchByIdAndCabinClass...');
    return await this.iataCodesRepository.fetchByIdAndCabinClass(
      id,
      cabinClass,
    );
  }
}

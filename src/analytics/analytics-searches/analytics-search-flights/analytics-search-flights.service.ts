import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { AnalyticsSearchFlight } from './analytics-search-flight.mongo-entity';
import { AnalyticsSearchFlightsRepository } from './analytics-search-flights.repository';
import { CreateAnalyticsSearchFlightRequestDto } from './dtos/request/create-analytics-search-flight-request.dto';
import { UpdateAnalyticsSearchFlightRequestDto } from './dtos/request/update-analytics-search-flight-request.dto';

@Injectable()
export class AnalyticsSearchFlightsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly analyticsSearchFlightsRepository: AnalyticsSearchFlightsRepository,
  ) {}

  async create(requestDto: CreateAnalyticsSearchFlightRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateAnalyticsSearchFlightRequestDto,
      AnalyticsSearchFlight,
    );

    return await this.analyticsSearchFlightsRepository.create(entity);
  }

  async fetchAll(): Promise<AnalyticsSearchFlight[]>;
  async fetchAll(
    queryDto: PaginationQueryDto,
  ): Promise<AnalyticsSearchFlight[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.analyticsSearchFlightsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.analyticsSearchFlightsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: string) {
    this.loggerService.log('fetchById...');

    const entity = await this.analyticsSearchFlightsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateAnalyticsSearchFlightRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateAnalyticsSearchFlightRequestDto,
      AnalyticsSearchFlight,
    );

    const [entityUpdate] = await Promise.all([
      this.analyticsSearchFlightsRepository.update(entity),
    ]);

    return entityUpdate;
  }

  async deleteById(id: string) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.analyticsSearchFlightsRepository.deleteById(
      id,
    );
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}

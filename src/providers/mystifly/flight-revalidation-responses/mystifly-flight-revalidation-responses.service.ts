import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { TransactionFlightsService } from '../../../transactions/flights/transaction-flights.service';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightRevalidationResponseRequestDto } from './dtos/request/create-mystifly-flight-revalidation-response-request.dto';
import { UpdateMystiflyFlightRevalidationResponseRequestDto } from './dtos/request/update-mystifly-flight-revalidation-response-request.dto';
import { MystiflyFlightRevalidationResponse } from './mystifly-flight-revalidation-response.entity';
import { MystiflyFlightRevalidationResponsesRepository } from './mystifly-flight-revalidation-responses.repository';

@Injectable()
export class MystiflyFlightRevalidationResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightRevalidationResponsesRepository: MystiflyFlightRevalidationResponsesRepository,
    private readonly transactionFlightsService: TransactionFlightsService,
  ) {}

  async create(requestDto: CreateMystiflyFlightRevalidationResponseRequestDto) {
    this.loggerService.log('create...');

    const transactionFlight =
      await this.transactionFlightsService.fetchByTransactionId(
        requestDto.transactionId,
      );
    if (!transactionFlight)
      this.errorHandlerService.notFoundException(
        'TransactionFlight: Id not found',
      );

    const entity = this.classMapper.map(
      requestDto,
      CreateMystiflyFlightRevalidationResponseRequestDto,
      MystiflyFlightRevalidationResponse,
    );
    entity.userId = this.request.user?.id ?? null;

    return await this.mystiflyFlightRevalidationResponsesRepository.create(
      entity,
    );
  }

  async fetchAll(): Promise<MystiflyFlightRevalidationResponse[]>;
  async fetchAll(
    queryDto: PaginationQueryDto,
  ): Promise<MystiflyFlightRevalidationResponse[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.mystiflyFlightRevalidationResponsesRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.mystiflyFlightRevalidationResponsesRepository.fetchAll(
            queryDto,
          );
    }
  }

  async fetchAllByTransactionFlightId(transactionFlightId: number) {
    this.loggerService.log('fetchAllByTransactionFlightId...');
    return await this.mystiflyFlightRevalidationResponsesRepository.fetchAllByTransactionFlightId(
      transactionFlightId,
    );
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity =
      await this.mystiflyFlightRevalidationResponsesRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateMystiflyFlightRevalidationResponseRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateMystiflyFlightRevalidationResponseRequestDto,
      MystiflyFlightRevalidationResponse,
    );

    return await this.mystiflyFlightRevalidationResponsesRepository.update(
      entity,
    );
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess =
      await this.mystiflyFlightRevalidationResponsesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}

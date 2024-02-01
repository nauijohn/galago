import { v4 as uuidv4 } from 'uuid';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { TransactionFlightsService } from '../../../transactions/flights/transaction-flights.service';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightFareRulesResponseRequestDto } from './dtos/request/create-mystifly-flight-fare-rules-response-request.dto';
import {
  CreateMystiflyFlightRoundtripFareRulesFareRulesResponseRequest,
  CreateMystiflyFlightRoundtripFareRulesResponseRequestDto,
} from './dtos/request/create-mystifly-flight-roundtrip-fare-rules-response-request.dto';
import { UpdateMystiflyFlightFareRulesResponseRequestDto } from './dtos/request/update-mystifly-flight-fare-rules-response-request.dto';
import { MystiflyFlightFareRulesResponse } from './mystifly-flight-fare-rules-response.entity';
import { MystiflyFlightFareRulesResponsesRepository } from './mystifly-flight-fare-rules-responses.repository';

@Injectable()
export class MystiflyFlightFareRulesResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightFareRulesResponsesRepository: MystiflyFlightFareRulesResponsesRepository,
    private readonly transactionFlightsService: TransactionFlightsService,
  ) {}

  async create(requestDto: CreateMystiflyFlightFareRulesResponseRequestDto) {
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
      CreateMystiflyFlightFareRulesResponseRequestDto,
      MystiflyFlightFareRulesResponse,
    );
    entity.userId = this.request.user?.id ?? null;

    return await this.mystiflyFlightFareRulesResponsesRepository.create(entity);
  }

  async createOneWay(
    requestDto: CreateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('createOneWay...');
    return await this.create(requestDto);
  }

  async createRoundtrip(
    requestDto: CreateMystiflyFlightRoundtripFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('createRoundtrip...');
    const {
      departureFareRulesResponse,
      returnFareRulesResponse,
      transactionId,
    } = requestDto;

    // const transactionFlight =
    //   await this.transactionFlightsService.fetchByTransactionId(transactionId);

    const providerReference = uuidv4();

    const entityDeparture = this.classMapper.map(
      departureFareRulesResponse,
      CreateMystiflyFlightRoundtripFareRulesFareRulesResponseRequest,
      MystiflyFlightFareRulesResponse,
    );
    entityDeparture.userId = this.request.user?.id ?? null;
    entityDeparture.sequence = 1;

    entityDeparture.providerReference = providerReference;

    const entityReturn = this.classMapper.map(
      returnFareRulesResponse,
      CreateMystiflyFlightRoundtripFareRulesFareRulesResponseRequest,
      MystiflyFlightFareRulesResponse,
    );
    entityReturn.userId = this.request.user?.id ?? null;
    entityReturn.sequence = 2;
    entityReturn.providerReference = providerReference;

    const [
      mystiflyFlightFareRulesResponseDepartureResponse,
      mystiflyFlightFareRulesResponseReturnResponse,
    ] = await Promise.all([
      this.mystiflyFlightFareRulesResponsesRepository.create(entityDeparture),
      this.mystiflyFlightFareRulesResponsesRepository.create(entityReturn),
    ]);

    return {
      mystiflyFlightFareRulesResponseDeparture:
        mystiflyFlightFareRulesResponseDepartureResponse,
      mystiflyFlightFareRulesResponseReturn:
        mystiflyFlightFareRulesResponseReturnResponse,
    };
  }

  async fetchAll(): Promise<MystiflyFlightFareRulesResponse[]>;
  async fetchAll(
    queryDto: PaginationQueryDto,
  ): Promise<MystiflyFlightFareRulesResponse[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.mystiflyFlightFareRulesResponsesRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.mystiflyFlightFareRulesResponsesRepository.fetchAll(
            queryDto,
          );
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity =
      await this.mystiflyFlightFareRulesResponsesRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateMystiflyFlightFareRulesResponseRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateMystiflyFlightFareRulesResponseRequestDto,
      MystiflyFlightFareRulesResponse,
    );

    return await this.mystiflyFlightFareRulesResponsesRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess =
      await this.mystiflyFlightFareRulesResponsesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}

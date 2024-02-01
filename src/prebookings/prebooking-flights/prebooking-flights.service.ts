import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { FlightType } from '../../common/enums/flight-type.enum';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { TransactionFlightsService } from '../../transactions/flights/transaction-flights.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PrebookingFlightProcessesService } from '../prebooking-flight-processes/prebooking-flight-processes.service';
import { CreateOneWayPrebookingFlightRequestDto } from './dtos/request/create-one-way-prebooking-flight-request.dto';
import { CreatePrebookingFlightRequestDto } from './dtos/request/create-prebooking-flight-request.dto';
import {
  CreateRoundtripPrebookingFlightRequestDto,
  CreateRoundtripV2PrebookingFlightRequestDto,
} from './dtos/request/create-roundtrip-prebooking-flight-request.dto';
import { UpdatePrebookingFlightRequestDto } from './dtos/request/update-prebooking-flight-request.dto';
import { PrebookingFlight } from './prebooking-flight.entity';
import { PrebookingFlightsRepository } from './prebooking-flights.repository';

@Injectable()
export class PrebookingFlightsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly prebookingFlightsRepository: PrebookingFlightsRepository,
    private readonly transactionFlightsService: TransactionFlightsService,
    private readonly prebookingFlightProcessesService: PrebookingFlightProcessesService,
  ) {}

  async create(requestDto: CreatePrebookingFlightRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreatePrebookingFlightRequestDto,
      PrebookingFlight,
    );
    entity.userId = this.request.user?.id ?? null;

    return await this.prebookingFlightsRepository.create(entity);
  }

  async createOneWay(requestDto: CreateOneWayPrebookingFlightRequestDto) {
    this.loggerService.log('createOneWay...');

    console.log('requestDto: ', requestDto);

    const transactionFlight =
      await this.transactionFlightsService.fetchByTransactionId(
        requestDto.transactionId,
      );
    if (transactionFlight.prebookingFlight)
      this.errorHandlerService.internalServerErrorException(
        'TransactionFlight already pre-booked!',
      );

    const entity = this.classMapper.map(
      requestDto,
      CreateOneWayPrebookingFlightRequestDto,
      PrebookingFlight,
    );
    entity.userId = this.request.user?.id ?? null;

    const entityNew = await this.prebookingFlightsRepository.create(entity);

    const updateTransactionFlightRequestDto =
      await this.prebookingFlightProcessesService.processFlightPrebooking(
        requestDto.provider,
        {
          flightType: FlightType.OneWay,
          providerDetails: requestDto.providerDetails,
          transactionId: requestDto.transactionId,
          transactionFlightId: transactionFlight.id,
          prebookingFlight: entityNew,
        },
      );

    await this.transactionFlightsService.update(
      updateTransactionFlightRequestDto,
    );

    return entityNew;
  }

  async createRoundtripV2(
    requestDto: CreateRoundtripV2PrebookingFlightRequestDto,
  ) {
    this.loggerService.log('createRoundtripV2...');

    console.log('requestDto: ', requestDto);

    console.log('requestDto.transactionId: ', requestDto.transactionId);

    const transactionFlight =
      await this.transactionFlightsService.fetchByTransactionId(
        requestDto.transactionId,
      );

    console.log('transactionFlight: ', transactionFlight);

    if (transactionFlight.prebookingFlight)
      this.errorHandlerService.internalServerErrorException(
        'TransactionFlight already pre-booked!',
      );

    const entity = this.classMapper.map(
      requestDto,
      CreateRoundtripV2PrebookingFlightRequestDto,
      PrebookingFlight,
    );
    entity.userId = this.request.user?.id ?? null;

    const entityNew = await this.prebookingFlightsRepository.create(entity);

    const updateTransactionFlightRequestDto =
      await this.prebookingFlightProcessesService.processFlightPrebooking(
        requestDto.provider,
        {
          flightType: FlightType.Roundtrip,
          providerDetails: requestDto.providerDetails,
          transactionId: requestDto.transactionId,
          transactionFlightId: transactionFlight.id,
          prebookingFlight: entityNew,
        },
      );

    console.log(
      'updateTransactionFlightRequestDto: ',
      updateTransactionFlightRequestDto,
    );

    await this.transactionFlightsService.update(
      updateTransactionFlightRequestDto,
    );

    return entityNew;
  }

  async fetchAll(): Promise<PrebookingFlight[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PrebookingFlight[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.prebookingFlightsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.prebookingFlightsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.prebookingFlightsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdatePrebookingFlightRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdatePrebookingFlightRequestDto,
      PrebookingFlight,
    );

    return await this.prebookingFlightsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.prebookingFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async createRoundtrip(requestDto: CreateRoundtripPrebookingFlightRequestDto) {
    this.loggerService.log('createRoundtrip...');
    const { provider, transactionId } = requestDto;

    const transactionFlight =
      await this.transactionFlightsService.fetchByTransactionId(transactionId);

    if (transactionFlight.prebookingFlight)
      this.errorHandlerService.internalServerErrorException(
        'TransactionFlight already pre-booked!',
      );

    const entity = this.classMapper.map(
      requestDto,
      CreateRoundtripPrebookingFlightRequestDto,
      PrebookingFlight,
    );
    entity.userId = this.request.user?.id ?? null;

    const entityNew = await this.prebookingFlightsRepository.create(entity);

    const updateTransactionFlightRequestDto =
      await this.prebookingFlightProcessesService.processFlightPrebooking(
        provider,
        {
          flightType: FlightType.RoundtripOld,
          providerDetails: requestDto.providerDetails,
          transactionId,
          transactionFlightId: transactionFlight.id,
          prebookingFlight: entityNew,
        },
      );

    await this.transactionFlightsService.update(
      updateTransactionFlightRequestDto,
    );

    return entityNew;
  }
}

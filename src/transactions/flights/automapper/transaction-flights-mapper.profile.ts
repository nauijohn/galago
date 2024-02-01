import { v4 as uuidv4 } from 'uuid';

import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateTransactionFlightRequestDto } from '../dtos/request/create-transaction-flight-request.dto';
import { UpdateTransactionFlightRequestDto } from '../dtos/request/update-transaction-flight-request.dto';
import { TransactionFlight } from '../transaction-flight.entity';

@Injectable()
export class TransactionFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateTransactionFlightRequestDto,
        TransactionFlight,
        forMember(
          (destination) => destination.flightReference,
          mapFrom((source) => `${uuidv4()}`),
        ),
      );

      createMap(mapper, UpdateTransactionFlightRequestDto, TransactionFlight);
    };
  }
}

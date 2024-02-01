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

import { FlightType } from '../../../common/enums/flight-type.enum';
import { CreateOneWayPrebookingFlightRequestDto } from '../dtos/request/create-one-way-prebooking-flight-request.dto';
import { CreatePrebookingFlightRequestDto } from '../dtos/request/create-prebooking-flight-request.dto';
import {
  CreateRoundtripPrebookingFlightRequestDto,
  CreateRoundtripV2PrebookingFlightRequestDto,
} from '../dtos/request/create-roundtrip-prebooking-flight-request.dto';
import { UpdatePrebookingFlightRequestDto } from '../dtos/request/update-prebooking-flight-request.dto';
import { PrebookingFlight } from '../prebooking-flight.entity';

@Injectable()
export class PrebookingFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePrebookingFlightRequestDto,
        PrebookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => FlightType.OneWay),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => `${uuidv4()}`),
        ),
      );

      createMap(
        mapper,
        CreateOneWayPrebookingFlightRequestDto,
        PrebookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => FlightType.OneWay),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => `${uuidv4()}`),
        ),
      );

      createMap(
        mapper,
        CreateRoundtripPrebookingFlightRequestDto,
        PrebookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => FlightType.RoundtripOld),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => `${uuidv4()}`),
        ),
      );

      createMap(
        mapper,
        CreateRoundtripV2PrebookingFlightRequestDto,
        PrebookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => FlightType.Roundtrip),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => `${uuidv4()}`),
        ),
      );

      createMap(mapper, UpdatePrebookingFlightRequestDto, PrebookingFlight);
    };
  }
}

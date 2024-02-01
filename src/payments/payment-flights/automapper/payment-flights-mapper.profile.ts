import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePaymentFlightRequestDto } from '../dtos/request/create-payment-flight-request.dto';
import { UpdatePaymentFlightRequestDto } from '../dtos/request/update-payment-flight-request.dto';
import { PaymentFlight } from '../payment-flight.entity';

@Injectable()
export class PaymentFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePaymentFlightRequestDto,
        PaymentFlight,
        forMember(
          (destination) => destination.originalAmount,
          mapFrom((source) => source.amount),
        ),
        forMember(
          (destination) => destination.promoCodes,
          mapFrom((source) => [...new Set(source.promoCodes)]),
        ),
      );
      createMap(mapper, UpdatePaymentFlightRequestDto, PaymentFlight);
    };
  }
}

import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePricingFlightRequestDto } from '../dtos/request/create-pricing-flight-request.dto';
import { UpdatePricingFlightRequestDto } from '../dtos/request/update-pricing-flight-request.dto';
import { PricingFlight } from '../pricing-flight.entity';

@Injectable()
export class PricingFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreatePricingFlightRequestDto, PricingFlight);
      createMap(mapper, UpdatePricingFlightRequestDto, PricingFlight);
    };
  }
}

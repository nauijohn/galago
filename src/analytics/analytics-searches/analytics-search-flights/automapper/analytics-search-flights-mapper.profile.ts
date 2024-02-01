import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { AnalyticsSearchFlight } from '../analytics-search-flight.mongo-entity';
import { CreateAnalyticsSearchFlightRequestDto } from '../dtos/request/create-analytics-search-flight-request.dto';
import { UpdateAnalyticsSearchFlightRequestDto } from '../dtos/request/update-analytics-search-flight-request.dto';

@Injectable()
export class AnalyticsSearchFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateAnalyticsSearchFlightRequestDto,
        AnalyticsSearchFlight,
      );
      createMap(
        mapper,
        UpdateAnalyticsSearchFlightRequestDto,
        AnalyticsSearchFlight,
      );
    };
  }
}

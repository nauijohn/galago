import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  namingConventions,
  PascalCaseNamingConvention,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateMystiflyFlightRevalidationResponseRequestDto } from '../dtos/request/create-mystifly-flight-revalidation-response-request.dto';
import { UpdateMystiflyFlightRevalidationResponseRequestDto } from '../dtos/request/update-mystifly-flight-revalidation-response-request.dto';
import { MystiflyFlightRevalidationResponse } from '../mystifly-flight-revalidation-response.entity';

@Injectable()
export class MystiflyFlightRevalidationResponsesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateMystiflyFlightRevalidationResponseRequestDto,
        MystiflyFlightRevalidationResponse,
        namingConventions(new PascalCaseNamingConvention()),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => source.sequence),
        ),
      );

      createMap(
        mapper,
        UpdateMystiflyFlightRevalidationResponseRequestDto,
        MystiflyFlightRevalidationResponse,
        namingConventions(new PascalCaseNamingConvention()),
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => source.sequence),
        ),
      );
    };
  }
}

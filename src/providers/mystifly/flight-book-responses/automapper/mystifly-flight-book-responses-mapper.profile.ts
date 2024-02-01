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

import { CreateMystiflyFlightBookResponseRequestDto } from '../dtos/request/create-mystifly-flight-book-response-request.dto';
import { UpdateMystiflyFlightBookResponseRequestDto } from '../dtos/request/update-mystifly-flight-book-response-request.dto';
import { MystiflyFlightBookResponse } from '../mystifly-flight-book-response.entity';

@Injectable()
export class MystiflyFlightBookResponsesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateMystiflyFlightBookResponseRequestDto,
        MystiflyFlightBookResponse,
        namingConventions(new PascalCaseNamingConvention()),
        forMember(
          (destination) => destination.paymentReferenceNumber,
          mapFrom((source) => source.paymentReferenceNumber),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => source.sequence),
        ),
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
        ),
        forMember(
          (destination) => destination.fareSourceCode,
          mapFrom((source) => source.fareSourceCode),
        ),
      );

      createMap(
        mapper,
        UpdateMystiflyFlightBookResponseRequestDto,
        MystiflyFlightBookResponse,
        namingConventions(new PascalCaseNamingConvention()),
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.paymentReferenceNumber,
          mapFrom((source) => source.paymentReferenceNumber),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => source.sequence),
        ),
        forMember(
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
        ),
        forMember(
          (destination) => destination.fareSourceCode,
          mapFrom((source) => source.fareSourceCode),
        ),
      );
    };
  }
}

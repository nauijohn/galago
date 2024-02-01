import {
  createMap,
  Mapper,
  MappingProfile,
  namingConventions,
  PascalCaseNamingConvention,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateScrappingsTboHotelRequestDto } from '../dtos/request/create-scrappings-tbo-hotel-request.dto';
import { UpdateScrappingsTboHotelRequestDto } from '../dtos/request/update-scrappings-tbo-hotel-request.dto';
import { ScrappingsTboHotel } from '../scrappings-tbo-hotel.mongo-entity';

@Injectable()
export class ScrappingsTboHotelsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateScrappingsTboHotelRequestDto,
        ScrappingsTboHotel,
        namingConventions(new PascalCaseNamingConvention()),
      );
      createMap(mapper, UpdateScrappingsTboHotelRequestDto, ScrappingsTboHotel);
    };
  }
}

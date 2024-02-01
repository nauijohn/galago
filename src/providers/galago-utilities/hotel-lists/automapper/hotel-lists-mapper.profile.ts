import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { HotelListDto } from '../dtos/hotel-list.dto';
import { HotelList } from '../hotel-list.schema';

export class HotelListsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        HotelList,
        HotelListDto,
        // namingConventions(new PascalCaseNamingConvention()),
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id.toString()),
        ),
      );
    };
  }
}

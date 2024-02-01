import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { AirlineList } from '../airline-list.schema';
import { AirlineListDto } from '../dtos/airline-list.dto';

export class AirlineListsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        AirlineList,
        AirlineListDto,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id.toString()),
        ),
      );
    };
  }
}

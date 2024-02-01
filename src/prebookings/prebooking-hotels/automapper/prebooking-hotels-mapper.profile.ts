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

import { CreatePrebookingHotelRequestDto } from '../dtos/request/create-prebooking-hotel-request.dto';
import { UpdatePrebookingHotelRequestDto } from '../dtos/request/update-prebooking-hotel-request.dto';
import { PrebookingHotel } from '../prebooking-hotel.entity';

@Injectable()
export class PrebookingHotelsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePrebookingHotelRequestDto,
        PrebookingHotel,
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => `${uuidv4()}`),
        ),
      );
      createMap(mapper, UpdatePrebookingHotelRequestDto, PrebookingHotel);
    };
  }
}

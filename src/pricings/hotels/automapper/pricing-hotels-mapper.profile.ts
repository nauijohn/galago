import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePricingHotelRequestDto } from '../dtos/request/create-pricing-hotel-request.dto';
import { UpdatePricingHotelRequestDto } from '../dtos/request/update-pricing-hotel-request.dto';
import { PricingHotel } from '../pricing-hotel.entity';

@Injectable()
export class PricingHotelsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreatePricingHotelRequestDto, PricingHotel);
      createMap(mapper, UpdatePricingHotelRequestDto, PricingHotel);
    };
  }
}

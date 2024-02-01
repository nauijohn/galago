import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePromoCodeRequestDto } from '../dtos/request/create-promo-code-request.dto';
import { UpdatePromoCodeRequestDto } from '../dtos/request/update-promo-code-request.dto';
import { PromoCode } from '../promo-code.entity';

@Injectable()
export class PromoCodesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreatePromoCodeRequestDto, PromoCode);
      createMap(mapper, UpdatePromoCodeRequestDto, PromoCode);
    };
  }
}

import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePaymentHotelsRequestDto } from '../dtos/request/create-payment-hotels-request.dto';
import { UpdatePaymentHotelsRequestDto } from '../dtos/request/update-payment-hotels-request.dto';
import { PaymentHotel } from '../payment-hotel.entity';

@Injectable()
export class PaymentHotelsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreatePaymentHotelsRequestDto, PaymentHotel);
      createMap(mapper, UpdatePaymentHotelsRequestDto, PaymentHotel);
    };
  }
}

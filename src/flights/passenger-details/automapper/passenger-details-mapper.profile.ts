import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { UtilsService } from '../../../utils/utils.service';
import { CreatePassengerDetailRequestDto } from '../dtos/request/create-passenger-detail-request.dto';
import { UpdatePassengerDetailRequestDto } from '../dtos/request/update-passenger-detail-request.dto';
import { PassengerDetail } from '../passenger-detail.entity';

@Injectable()
export class PassengerDetailsMapperProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
    private readonly utilsService: UtilsService,
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePassengerDetailRequestDto,
        PassengerDetail,
        forMember(
          (destination) => destination.passengerType,
          mapFrom((source) => {
            const { birthDate } = source;
            return this.determineMystiflyPassengerTypeByBirthDate(birthDate);
          }),
        ),
      );
      createMap(mapper, UpdatePassengerDetailRequestDto, PassengerDetail);
    };
  }

  determineMystiflyPassengerTypeByBirthDate(birthDate: string) {
    const passengerAge = this.utilsService.calcAgeByBirthDate(birthDate);
    if (passengerAge < 2) return 'infant';
    if (passengerAge < 12) return 'child';
    return 'adult';
  }
}

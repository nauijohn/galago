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
import { CustomerFlightDetail } from '../customer-flight-detail.entity';
import { CreateCustomerFlightDetailRequestDto } from '../dtos/request/create-customer-flight-detail-request.dto';
import { UpdateCustomerFlightDetailRequestDto } from '../dtos/request/update-customer-flight-detail-request.dto';

@Injectable()
export class CustomerFlightDetailsMapperProfile extends AutomapperProfile {
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
        CreateCustomerFlightDetailRequestDto,
        CustomerFlightDetail,
        forMember(
          (destination) => destination.mobileNumber,
          mapFrom((source) =>
            this.utilsService.isNotUndefinedOrNullOrEmptyString(
              source.mobileNumber,
            )
              ? source.mobileNumber
              : '',
          ),
        ),
      );

      createMap(
        mapper,
        UpdateCustomerFlightDetailRequestDto,
        CustomerFlightDetail,
      );
    };
  }
}

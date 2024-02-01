import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { FlightType } from '../../../common/enums/flight-type.enum';
import { CreatePassengerDetailRequestDto } from '../../../flights/passenger-details/dtos/request/create-passenger-detail-request.dto';
import { PassengerDetail } from '../../../flights/passenger-details/passenger-detail.entity';
import { CreateMystiflyFlightDetailRequestDto } from '../../../providers/mystifly/flight-details/dtos/request/create-mystifly-flight-detail-request.dto';
import { MystiflyFlightDetail } from '../../../providers/mystifly/flight-details/mystifly-flight-detail.entity';
import { BookingFlight } from '../booking-flight.entity';
import { CreateBookingFlightRequestDto } from '../dtos/request/create-booking-flight-request.dto';
import { CreateRoundtripV2BookingFlightRequestDto } from '../dtos/request/create-roundtip-v2-booking-flight-request.dto';
import { CreateRoundtripBookingFlightRequestDto } from '../dtos/request/create-roundtrip-booking-flight-request.dto';
import { UpdateBookingFlightRequestDto } from '../dtos/request/update-booking-flight-request.dto';

@Injectable()
export class BookingFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateBookingFlightRequestDto,
        BookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => FlightType.OneWay),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => 1),
        ),
      );

      createMap(
        mapper,
        CreateRoundtripBookingFlightRequestDto,
        BookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => FlightType.RoundtripOld),
        ),
      );

      createMap(
        mapper,
        CreateRoundtripV2BookingFlightRequestDto,
        BookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => FlightType.Roundtrip),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => 1),
        ),
      );

      createMap(
        mapper,
        CreateMystiflyFlightDetailRequestDto,
        MystiflyFlightDetail,
        forMember(
          (destination) => destination.fareSourceCode,
          mapFrom((source) => source.FareSourceCode),
        ),
        forMember(
          (destination) => destination.flightFares,
          mapFrom((source) => source.FlightFares),
        ),
        forMember(
          (destination) => destination.originDestinations,
          mapFrom((source) => source.OriginDestinations),
        ),
        forMember(
          (destination) => destination.penaltiesInfo,
          mapFrom((source) => source.PenaltiesInfo),
        ),
        forMember(
          (destination) => destination.validatingCarrier,
          mapFrom((source) => source.ValidatingCarrier),
        ),
      );

      createMap(
        mapper,
        CreatePassengerDetailRequestDto,
        PassengerDetail,
        forMember(
          (destination) => destination.birthDate,
          mapFrom((source) => source.birthDate),
        ),
        forMember(
          (destination) => destination.expirationDate,
          mapFrom((source) => source.expirationDate),
        ),
        forMember(
          (destination) => destination.firstName,
          mapFrom((source) => source.firstName),
        ),
        forMember(
          (destination) => destination.lastName,
          mapFrom((source) => source.lastName),
        ),
        forMember(
          (destination) => destination.middleName,
          mapFrom((source) => source.middleName),
        ),
        forMember(
          (destination) => destination.nationality,
          mapFrom((source) => source.nationality),
        ),
        forMember(
          (destination) => destination.passportNumber,
          mapFrom((source) => source.passportNumber),
        ),
        forMember(
          (destination) => destination.countryIssued,
          mapFrom((source) => source.countryIssued),
        ),
        forMember(
          (destination) => destination.title,
          mapFrom((source) => source.title),
        ),
      );

      createMap(mapper, UpdateBookingFlightRequestDto, BookingFlight);
    };
  }
}

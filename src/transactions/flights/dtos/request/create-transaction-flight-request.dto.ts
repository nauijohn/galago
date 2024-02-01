import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { FlightType } from '../../../../common/enums/flight-type.enum';

export class CreateTransactionFlightRequestDto {
  @AutoMap()
  origin?: string;

  @AutoMap()
  destination?: string;

  @AutoMap()
  departureDate?: Date;

  @AutoMap()
  adults?: number;

  @AutoMap()
  children?: number;

  @AutoMap()
  infants?: number;

  @AutoMap()
  cabinClass?: string;

  @Transform(({ value }) => (String(value) === 'null' ? null : value))
  @AutoMap()
  returnDate?: Date;

  @Transform(({ value }) => {
    if (`${value}` === 'one-way') return FlightType.OneWay;
    if (`${value}` === 'round-trip') return FlightType.Roundtrip;
    return value;
  })
  @AutoMap()
  flightType?: FlightType;
}

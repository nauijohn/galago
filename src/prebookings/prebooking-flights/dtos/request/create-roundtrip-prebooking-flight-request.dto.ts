import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { FlightProvider } from '../../../../common/enums/flight-provider.enum';

export class CreateRoundtripPrebookingFlightRequestDto {
  @AutoMap()
  transactionId?: string;

  @Transform(({ value }) =>
    `${value}` === '765J' ? FlightProvider.Mystifly : `${value}`.toLowerCase(),
  )
  @AutoMap()
  provider?: FlightProvider;

  providerDetails?: {
    departureDetails?: any;
    returnDetails?: any;
  };
}

export class CreateRoundtripV2PrebookingFlightRequestDto {
  @Transform(({ value }) =>
    `${value}` === '765J' ? FlightProvider.Mystifly : `${value}`.toLowerCase(),
  )
  @AutoMap()
  provider?: FlightProvider;

  transactionId?: string;

  providerDetails?: any;
}

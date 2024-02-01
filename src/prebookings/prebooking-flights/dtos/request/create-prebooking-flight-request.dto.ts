import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { FlightProvider } from '../../../../common/enums/flight-provider.enum';

export class CreatePrebookingFlightRequestDto {
  @Transform(({ value }) =>
    `${value}` === '765J' ? FlightProvider.Mystifly : `${value}`.toLowerCase(),
  )
  @AutoMap()
  provider?: FlightProvider;

  transactionId?: string;

  providerDetails?: any;
}

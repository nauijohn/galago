import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

import { MystiflyFlightBookResponse } from '../../../../providers/mystifly/flight-book-responses/mystifly-flight-book-response.entity';
import { CreateBookingFlightRequestDto } from './create-booking-flight-request.dto';

export class UpdateBookingFlightRequestDto extends CreateBookingFlightRequestDto {
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;

  @AutoMap(() => MystiflyFlightBookResponse)
  mystiflyFlightBookResponse?: MystiflyFlightBookResponse;
}

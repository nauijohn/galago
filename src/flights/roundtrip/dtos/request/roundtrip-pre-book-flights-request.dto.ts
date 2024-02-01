import { OneWayPreBookFlightsRequestDto } from '../../../../flights/one-way/dtos/request/one-way-pre-book-flights-request.dto';

export class RoundtripPreBookFlightsRequestDto {
  departureRequest: OneWayPreBookFlightsRequestDto;
  returnRequest: OneWayPreBookFlightsRequestDto;
}

export class RoundtripPreBookFlightsRequestDto2 extends OneWayPreBookFlightsRequestDto {}

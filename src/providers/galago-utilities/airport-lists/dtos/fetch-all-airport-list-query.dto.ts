import { Transform } from 'class-transformer';

export class FetchAllAirportListQueryDto {
  @Transform(({ value }) => parseInt(value))
  pagination: number = 10;

  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  airportSearch: string;
  airportCode?: string;
  airportName?: string;
  cityCode?: string;
  cityName?: string;
  countryName?: string;
  countryCode?: string;
}

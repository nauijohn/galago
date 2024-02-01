import { AutoMap } from '@automapper/classes';

export class AirportListDto {
  @AutoMap()
  _id: string;

  @AutoMap()
  airportCode: string;

  @AutoMap()
  airportName: string;

  @AutoMap()
  cityCode: string;

  @AutoMap()
  cityName: string;

  @AutoMap()
  countryName: string;

  @AutoMap()
  countryCode: string;
}

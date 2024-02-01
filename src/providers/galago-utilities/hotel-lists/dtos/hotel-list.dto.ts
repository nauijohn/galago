import { AutoMap } from '@automapper/classes';

export class HotelListDto {
  @AutoMap()
  _id: string;

  @AutoMap()
  HotelCode: string;

  @AutoMap()
  HotelName: string;

  @AutoMap()
  HotelRating: string;

  @AutoMap()
  Address: string;

  @AutoMap(() => Array<string>)
  Attractions: string[];

  @AutoMap()
  CountryName: string;

  @AutoMap()
  CountryCode: string;

  @AutoMap()
  Description: string;

  @AutoMap()
  FaxNumber: string;

  @AutoMap(() => Array<string>)
  HotelFacilities: string[];

  @AutoMap()
  Map: string;

  @AutoMap()
  PhoneNumber: string;

  @AutoMap()
  PinCode: string;

  @AutoMap()
  HotelWebsiteUrl: string;

  @AutoMap()
  CityName: string;
}

import { Transform } from 'class-transformer';

export class FetchAllHotelListQueryDto {
  @Transform(({ value }) => parseInt(value))
  pagination: number = 10;

  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  hotelSearch: string;
  cityCode?: string;
  cityName?: string;
}

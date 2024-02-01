import { Transform } from 'class-transformer';

export class FetchAllAirlineListQueryDto {
  @Transform(({ value }) => parseInt(value))
  pagination: number = 10;

  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  code: string;
}

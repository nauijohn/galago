import { Transform } from 'class-transformer';
import { FindOptionsOrderValue } from 'typeorm';

export class PaginationQueryDto {
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @Transform(({ value }) => parseInt(value))
  limit: number = 10;

  order: FindOptionsOrderValue = 'ASC';
}

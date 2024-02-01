import { AutoMap } from '@automapper/classes';

export class AirlineListDto {
  @AutoMap()
  _id: string;

  @AutoMap()
  code: string;

  @AutoMap()
  descriptions: string;
}

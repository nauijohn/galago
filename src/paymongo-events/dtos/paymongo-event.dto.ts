import { AutoMap } from '@automapper/classes';

export class PaymongoEventDto {
  @AutoMap()
  id: string;

  @AutoMap()
  eventId: string;

  @AutoMap()
  type: string;

  @AutoMap()
  data: any;

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}

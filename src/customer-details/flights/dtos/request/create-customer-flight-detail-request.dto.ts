import { AutoMap } from '@automapper/classes';

export class CreateCustomerFlightDetailRequestDto {
  @AutoMap()
  name?: string;

  @AutoMap()
  email?: string;

  @AutoMap()
  mobileNumber?: string;
}

import { AutoMap } from '@automapper/classes';

import { CreateAnalyticsSearchFlightRequestDto } from './create-analytics-search-flight-request.dto';

export class UpdateAnalyticsSearchFlightRequestDto extends CreateAnalyticsSearchFlightRequestDto {
  @AutoMap()
  id: string;
}

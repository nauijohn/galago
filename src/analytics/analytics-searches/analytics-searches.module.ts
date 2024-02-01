import { Module } from '@nestjs/common';

import { AnalyticsSearchFlightsModule } from './analytics-search-flights/analytics-search-flights.module';

@Module({
  imports: [AnalyticsSearchFlightsModule],
  exports: [AnalyticsSearchFlightsModule],
})
export class AnalyticsSearchesModule {}

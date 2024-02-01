import { Module } from '@nestjs/common';

import { AnalyticsSearchesModule } from './analytics-searches/analytics-searches.module';

@Module({
  imports: [AnalyticsSearchesModule],
  exports: [AnalyticsSearchesModule],
})
export class AnalyticsModule {}

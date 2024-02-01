import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TYPEORM_MONGODB } from '../../../config/config.constant';
import { UtilsModule } from '../../../utils/utils.module';
import { AnalyticsSearchFlight } from './analytics-search-flight.mongo-entity';
import { AnalyticsSearchFlightsController } from './analytics-search-flights.controller';
import { AnalyticsSearchFlightsRepository } from './analytics-search-flights.repository';
import { AnalyticsSearchFlightsService } from './analytics-search-flights.service';
import { AnalyticsSearchFlightsMapperProfile } from './automapper/analytics-search-flights-mapper.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyticsSearchFlight], TYPEORM_MONGODB),
    UtilsModule,
  ],
  controllers: [AnalyticsSearchFlightsController],
  providers: [
    AnalyticsSearchFlightsService,
    AnalyticsSearchFlightsRepository,
    AnalyticsSearchFlightsMapperProfile,
  ],
  exports: [AnalyticsSearchFlightsService],
})
export class AnalyticsSearchFlightsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UtilsModule } from '../../../utils/utils.module';
import { AirportList, AirportListSchema } from './airport-list.schema';
import { AirportListsController } from './airport-lists.controller';
import { AirportListsRepository } from './airport-lists.repository';
import { AirportListsService } from './airport-lists.service';
import { AirportListsMapperProfile } from './automapper/airport-lists-mapper.profile';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AirportList.name, schema: AirportListSchema },
    ]),
    UtilsModule,
  ],
  controllers: [AirportListsController],
  providers: [
    AirportListsService,
    AirportListsRepository,
    AirportListsMapperProfile,
  ],
  exports: [AirportListsService],
})
export class AirportListsModule {}

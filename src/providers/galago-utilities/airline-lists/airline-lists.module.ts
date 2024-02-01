import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UtilsModule } from '../../../utils/utils.module';
import { AirlineList, AirlineListSchema } from './airline-list.schema';
import { AirlineListsController } from './airline-lists.controller';
import { AirlineListsRepository } from './airline-lists.repository';
import { AirlineListsService } from './airline-lists.service';
import { AirlineListsMapperProfile } from './automapper/airline-lists-mapper.profile';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AirlineList.name, schema: AirlineListSchema },
    ]),
    UtilsModule,
  ],
  controllers: [AirlineListsController],
  providers: [
    AirlineListsService,
    AirlineListsRepository,
    AirlineListsMapperProfile,
  ],
  exports: [AirlineListsService],
})
export class AirlineListsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UtilsModule } from '../../../utils/utils.module';
import { HotelListsMapperProfile } from './automapper/hotel-lists-mapper.profile';
import { HotelList, HotelListSchema } from './hotel-list.schema';
import { HotelListsController } from './hotel-lists.controller';
import { HotelListsRepository } from './hotel-lists.repository';
import { HotelListsService } from './hotel-lists.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelList.name, schema: HotelListSchema },
    ]),
    UtilsModule,
  ],
  controllers: [HotelListsController],
  providers: [HotelListsService, HotelListsRepository, HotelListsMapperProfile],
  exports: [HotelListsService],
})
export class HotelListsModule {}

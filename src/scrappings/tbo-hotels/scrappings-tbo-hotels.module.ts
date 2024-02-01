import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TYPEORM_MONGODB } from '../../config/config.constant';
import { TboHotelUtilsModule } from '../../providers/tbo/hotel-utils/tbo-hotel-utils.module';
import { UtilsModule } from '../../utils/utils.module';
import { ScrappingsTboHotelsMapperProfile } from './automapper/scrappings-tbo-hotels-mapper.profile';
import { ScrappingsTboHotel } from './scrappings-tbo-hotel.mongo-entity';
import { ScrappingsTboHotelsController } from './scrappings-tbo-hotels.controller';
import { ScrappingsTboHotelsRepository } from './scrappings-tbo-hotels.repository';
import { ScrappingsTboHotelsService } from './scrappings-tbo-hotels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScrappingsTboHotel], TYPEORM_MONGODB),
    UtilsModule,
    TboHotelUtilsModule,
  ],
  controllers: [ScrappingsTboHotelsController],
  providers: [
    ScrappingsTboHotelsService,
    ScrappingsTboHotelsRepository,
    ScrappingsTboHotelsMapperProfile,
  ],
  exports: [ScrappingsTboHotelsService],
})
export class ScrappingsTboHotelsModule {}

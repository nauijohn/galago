import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionHotelsModule } from '../../transactions/hotels/transaction-hotels.module';
import { UtilsModule } from '../../utils/utils.module';
import { PrebookingHotelProcessesModule } from '../prebooking-hotel-processes/prebooking-hotel-processes.module';
import { PrebookingHotelsMapperProfile } from './automapper/prebooking-hotels-mapper.profile';
import { PrebookingHotel } from './prebooking-hotel.entity';
import { PrebookingHotelsController } from './prebooking-hotels.controller';
import { PrebookingHotelsRepository } from './prebooking-hotels.repository';
import { PrebookingHotelsService } from './prebooking-hotels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrebookingHotel]),
    UtilsModule,
    TransactionHotelsModule,
    PrebookingHotelProcessesModule,
  ],
  controllers: [PrebookingHotelsController],
  providers: [
    PrebookingHotelsService,
    PrebookingHotelsRepository,
    PrebookingHotelsMapperProfile,
  ],
  exports: [PrebookingHotelsService],
})
export class PrebookingHotelsModule {}

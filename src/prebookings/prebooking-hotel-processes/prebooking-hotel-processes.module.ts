import { Module } from '@nestjs/common';

import { TboHotelPrebookResponsesModule } from '../../providers/tbo/hotel-prebook-responses/tbo-hotel-prebook-responses.module';
import { PrebookingHotelProcessGateway } from './prebooking-hotel-processes.gateway';
import { PrebookingHotelProcessesService } from './prebooking-hotel-processes.service';

@Module({
  imports: [TboHotelPrebookResponsesModule],
  providers: [PrebookingHotelProcessesService, PrebookingHotelProcessGateway],
  exports: [PrebookingHotelProcessesService],
})
export class PrebookingHotelProcessesModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentsModule } from '../payments/payments.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UtilsModule } from '../utils/utils.module';
import { PaymongoEventMapperProfile } from './automapper/paymongo-event-mapper.profile';
import { PaymongoEventProcessesModule } from './paymongo-event-processes/paymongo-event-processes.module';
import { PaymongoEvent, PaymongoEventSchema } from './paymongo-event.schema';
import { PaymongoEventsController } from './paymongo-events.controller';
import { PaymongoEventsRepository } from './paymongo-events.repository';
import { PaymongoEventsService } from './paymongo-events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymongoEvent.name,
        schema: PaymongoEventSchema,
      },
    ]),
    UtilsModule,
    PaymentsModule,
    TransactionsModule,

    PaymongoEventProcessesModule,
  ],
  controllers: [PaymongoEventsController],
  providers: [
    PaymongoEventsService,
    PaymongoEventsRepository,
    PaymongoEventMapperProfile,
  ],
  exports: [PaymongoEventsService],
})
export class PaymongoEventsModule {}

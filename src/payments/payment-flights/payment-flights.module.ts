import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PromoCodesModule } from '../../promo-codes/promo-codes.module';
import { ProvidersModule } from '../../providers/providers.module';
import { UtilsModule } from '../../utils/utils.module';
import { PaymentFlightsMapperProfile } from './automapper/payment-flights-mapper.profile';
import { PaymentFlight } from './payment-flight.entity';
import { PaymentFlightsController } from './payment-flights.controller';
import { PaymentFlightsRepository } from './payment-flights.repository';
import { PaymentFlightsService } from './payment-flights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentFlight]),
    UtilsModule,
    ProvidersModule,
    forwardRef(() => PromoCodesModule),
  ],
  controllers: [PaymentFlightsController],
  providers: [
    PaymentFlightsService,
    PaymentFlightsRepository,
    PaymentFlightsMapperProfile,
  ],
  exports: [PaymentFlightsService],
})
export class PaymentFlightsModule {}

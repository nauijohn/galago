import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentFlightsModule } from '../payments/payment-flights/payment-flights.module';
import { UtilsModule } from '../utils/utils.module';
import { PromoCodesMapperProfile } from './automapper/promo-codes-mapper.profile';
import { PromoCode } from './promo-code.entity';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCodesRepository } from './promo-codes.repository';
import { PromoCodesService } from './promo-codes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromoCode]),
    UtilsModule,
    forwardRef(() => PaymentFlightsModule),
  ],
  controllers: [PromoCodesController],
  providers: [PromoCodesService, PromoCodesRepository, PromoCodesMapperProfile],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}

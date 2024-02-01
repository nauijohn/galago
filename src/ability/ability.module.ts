import { Module } from '@nestjs/common';

import { UtilsModule } from '../utils/utils.module';
import { AbilityFactory } from './ability.factory';

@Module({
  imports: [UtilsModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}

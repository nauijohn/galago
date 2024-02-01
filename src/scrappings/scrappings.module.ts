import { Module } from '@nestjs/common';

import { ScrappingsTboHotelsModule } from './tbo-hotels/scrappings-tbo-hotels.module';

@Module({
  imports: [ScrappingsTboHotelsModule],
  exports: [ScrappingsTboHotelsModule],
})
export class ScrappingsModule {}

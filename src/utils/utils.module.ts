import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ErrorHandlerService } from './error-handler.service';
import { MyLoggerService } from './my-logger.service';
import { SecurityService } from './security.service';
import { UtilsService } from './utils.service';

@Module({
  imports: [ConfigModule],
  providers: [
    MyLoggerService,
    ErrorHandlerService,
    UtilsService,
    SecurityService,
  ],
  exports: [
    MyLoggerService,
    ErrorHandlerService,
    UtilsService,
    SecurityService,
  ],
})
export class UtilsModule {}

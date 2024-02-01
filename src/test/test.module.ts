import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AbilityFactory } from '../ability/ability.factory';
import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/utils.module';
import { TestController } from './test.controller';

@Module({
  imports: [UsersModule, UtilsModule, HttpModule],
  providers: [AbilityFactory],
  controllers: [TestController],
})
export class TestModule {}

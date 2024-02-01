import { config as dotenvConfig } from 'dotenv';

import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import {
  MONGO_DB_URI,
  MONGODB,
  TYPEORM_MONGO_DB_OPTIONS,
  TYPEORM_MONGODB,
} from './config.constant';

dotenvConfig({ path: `.env.${process.env.STAGE}.${process.env.ENV}` });
const configService = new ConfigService();

export const typeormMongoDbOpts = {
  type: MONGODB,
  url: configService.get(MONGO_DB_URI),
  entities: ['dist/**/*.mongo-entity{.ts,.js}'],
  synchronize: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const typeormMongoDbConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  name: TYPEORM_MONGODB,
  useFactory: async (configService: ConfigService) =>
    configService.get(TYPEORM_MONGO_DB_OPTIONS),
};

export default registerAs(TYPEORM_MONGO_DB_OPTIONS, () => typeormMongoDbOpts);

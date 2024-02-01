import { ConfigModuleOptions } from '@nestjs/config';

import { configValidationSchema } from './config.schema';
import typeormMongoDbConfig from './typeorm-mongodb.config';
import typeormConfig from './typeorm.config';

export const config: ConfigModuleOptions = {
  envFilePath: [`.env.${process.env.STAGE}.${process.env.ENV}`],
  validationSchema: configValidationSchema,
  isGlobal: true,
  load: [typeormConfig, typeormMongoDbConfig],
};

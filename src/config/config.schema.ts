import * as Joi from 'joi';

import { POSTGRES_EXTRA } from './config.constant';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000).required(),
  MONGO_DB_URI: Joi.string().uri().required(),
  SESSION_SECRET: Joi.string().required(),
  SESSION_COOKIE_MAX_AGE: Joi.number().default(3600000).required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d').required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('30s').required(),
  MYSTIFLY_AUTH_BEARER: Joi.string().required(),
  MYSTIFLY_TARGET: Joi.string().default('Test').required(),
  MYSTIFLY_BASE_URL: Joi.string().required(),
  MYSTIFLY_REQUEST_OPTIONS: Joi.string().required(),
  TBO_BASE_URL: Joi.string().required(),
  TBO_AUTH_USERNAME: Joi.string().required(),
  TBO_AUTH_PASSWORD: Joi.string().required(),
  TRIPNINJA_BASE_URL: Joi.string().required(),
  TRIPNINJA_AUTH_USERNAME: Joi.string().required(),
  TRIPNINJA_AUTH_PASSWORD: Joi.string().required(),
  FACEBOOK_CLIENT_ID: Joi.string().required(),
  FACEBOOK_CLIENT_SECRET: Joi.string().required(),
  FACEBOOK_REDIRECT_URL: Joi.string().required(),
  AMADEUS_CLIENT_ID: Joi.string().required(),
  AMADEUS_CLIENT_SECRET: Joi.string().required(),
  REDIS_HOST: Joi.string().default('localhost').required(),
  REDIS_PORT: Joi.number().default(6379).required(),
  REDIS_TTL: Joi.number().default(86400000).required(),
  HTTP_TBO_HOTELS_TIMEOUT: Joi.number().default(15000).required(),
  HTTP_MYSTIFLY_FLIGHTS_TIMEOUT: Joi.number().default(15000).required(),
  PAYMONGO_BASE_URL: Joi.string().required(),
  PAYMONGO_AUTHORIZATION: Joi.string().required(),
  PAYMONGO_REDIRECT_BASE_URL: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USERNAME: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DATABASE: Joi.string().required(),
  POSTGRES_SYNCHRONIZE: Joi.boolean().required(),
  POSTGRES_SSL: Joi.boolean().required(),
  POSTGRES_EXTRA: Joi.boolean().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  MAILER_USER: Joi.string().required(),
  MAILER_PASS: Joi.string().required(),
  MAILER_HOST: Joi.string().required(),
  CREDENTIALS_IV: Joi.string().required(),
  CREDENTIALS_PASSWORD: Joi.string().required(),
  CREDENTIALS_SALT: Joi.string().required(),
  ANALYTICS_FLIGHTS_SEARCH: Joi.boolean().required(),
  X_API_KEY: Joi.string().required(),
});

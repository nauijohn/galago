import { Transform } from 'class-transformer';
import * as moment from 'moment';

import { AutoMap } from '@automapper/classes';

const pascalizeFirstWord = (word: string) => {
  const trimWord = word.trim();
  return word
    ? trimWord.charAt(0).toUpperCase() + trimWord.substring(1).toLowerCase()
    : word;
};

export class CreatePromoCodeRequestDto {
  @AutoMap()
  promoCode?: string;

  @Transform(({ value }) => moment(value).format('YYYY-MM-DD'))
  @AutoMap()
  fromDate?: string;

  @Transform(({ value }) => moment(value).format('YYYY-MM-DD'))
  @AutoMap()
  toDate?: string;

  @AutoMap()
  isEnabled?: boolean;

  @Transform(({ value }) => (value ? parseInt(value) : null))
  @AutoMap()
  maxUse?: number;

  @Transform(({ value }) => parseFloat(value))
  @AutoMap()
  percentage?: number;

  @Transform(({ value }) => parseFloat(value))
  @AutoMap()
  fixedAmount?: number;

  @Transform(({ value }) => `${value}`.toLowerCase())
  @AutoMap()
  priceMargin?: string;

  @Transform(({ value }) => `${value}`.toLowerCase())
  @AutoMap()
  type?: string;

  @Transform(({ value }) => pascalizeFirstWord(`${value}`))
  @AutoMap()
  description?: string;

  @AutoMap()
  isMultipleAllowed?: boolean;

  @Transform(({ value }) => parseFloat(value))
  @AutoMap()
  minValueApplied?: number;

  @Transform(({ value }) => parseFloat(value))
  @AutoMap()
  valueCap?: number;
}

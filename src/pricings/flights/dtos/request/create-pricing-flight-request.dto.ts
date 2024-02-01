import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { AutoMap } from '@automapper/classes';

import { IataCode } from '../../../../iataCodes/iata-code.entity';
import { CabinClass } from '../../cabin-class.enum';
import { PriceMargin } from '../../price-margin.enum';

export class CreatePricingFlightRequestDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IataCode)
  @AutoMap(() => IataCode)
  iataCode?: IataCode;

  @IsOptional()
  @IsNumber()
  @AutoMap()
  fixedAmount?: number;

  @IsOptional()
  @IsNumber()
  @AutoMap()
  percentage?: number;

  @IsOptional()
  @IsEnum(CabinClass)
  @AutoMap()
  cabinClass?: CabinClass;

  @IsOptional()
  @IsEnum(PriceMargin)
  @AutoMap()
  priceMargin?: PriceMargin;
}

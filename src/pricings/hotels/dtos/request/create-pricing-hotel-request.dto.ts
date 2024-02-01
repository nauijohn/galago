import { AutoMap } from '@automapper/classes';

import { PriceMargin } from '../../price-margin.enum';
import { Rating } from '../../rating.enum';

export class CreatePricingHotelRequestDto {
  @AutoMap()
  fixedAmount?: number;

  @AutoMap()
  percentage?: number;

  @AutoMap()
  rating?: Rating;

  @AutoMap()
  priceMargin?: PriceMargin;
}

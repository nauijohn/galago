import { Injectable } from '@nestjs/common';

import { HotelProvider } from '../../common/enums/hotel-provider.enum';
import { TboHotelPrebookResponsesService } from '../../providers/tbo/hotel-prebook-responses/tbo-hotel-prebook-responses.service';
import { TboPrebookingHotelProcess } from './processes/tbo-prebooking-hotel.process';

@Injectable()
export class PrebookingHotelProcessGateway {
  constructor(
    private readonly tboHotelPrebookResponsesService: TboHotelPrebookResponsesService,
  ) {}

  instantiate(provider: HotelProvider) {
    switch (provider) {
      case HotelProvider.Tbo:
        return new TboPrebookingHotelProcess(
          this.tboHotelPrebookResponsesService,
        );
      default:
        break;
    }
  }
}

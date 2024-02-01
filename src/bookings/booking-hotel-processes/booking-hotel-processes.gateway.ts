import { Injectable } from '@nestjs/common';

import { HotelProvider } from '../../common/enums/hotel-provider.enum';
import { TboHotelDetailsService } from '../../providers/tbo/hotel-details/tbo-hotel-details.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { TboBookingHotelProcess } from './processes/tbo-booking-hotel.process';

@Injectable()
export class BookingHotelProcessesGateway {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelDetailsService: TboHotelDetailsService,
  ) {}

  instantiate(provider: HotelProvider) {
    switch (provider) {
      case HotelProvider.Tbo:
        return new TboBookingHotelProcess(this.tboHotelDetailsService);
      default:
        this.errorHandlerService.internalServerErrorException(
          'No process for provider...',
        );
        break;
    }
  }
}

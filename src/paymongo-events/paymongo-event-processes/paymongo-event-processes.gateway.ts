import { Injectable } from '@nestjs/common';

import { BookingFlightsService } from '../../bookings/booking-flights/booking-flights.service';
import { BookingHotelsService } from '../../bookings/booking-hotels/booking-hotels.service';
import { FlightProvider } from '../../common/enums/flight-provider.enum';
import { HotelProvider } from '../../common/enums/hotel-provider.enum';
import { Product } from '../../common/enums/product.enum';
import { HotelsService } from '../../hotels/hotels.service';
import { NestMailerService } from '../../nest-mailer/nest-mailer.service';
import { MystiflyFlightBookResponsesService } from '../../providers/mystifly/flight-book-responses/mystifly-flight-book-responses.service';
import { MystiflyFlightUtilsService } from '../../providers/mystifly/flight-utils/mystifly-flight-utils.service';
import { TboHotelBookResponsesService } from '../../providers/tbo/hotel-book-responses/tbo-hotel-book-responses.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { UtilsService } from '../../utils/utils.service';
import { MystiflyFlightsPaymongoEventProcess } from './processes/flights/mystifly-flights-paymongo-event.process';
import { TboHotelsPaymongoEventProcess } from './processes/hotels/tbo-hotel-paymongo-event.process';

@Injectable()
export class PaymongoEventProcessesGateway {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly loggerService: MyLoggerService,
    private readonly utilsService: UtilsService,
    private readonly nestMailerService: NestMailerService,
    private readonly bookingFlightsService: BookingFlightsService,
    private readonly mystiflyFlightBookResponsesService: MystiflyFlightBookResponsesService,
    private readonly mystiflyFlightUtilsService: MystiflyFlightUtilsService,

    private readonly hotelsService: HotelsService,
    private readonly tboHotelBookResponsesService: TboHotelBookResponsesService,
    private readonly bookingHotelsService: BookingHotelsService,
  ) {}

  instantiate(product: Product, provider: FlightProvider | HotelProvider) {
    switch (product) {
      case Product.Flights: {
        switch (provider) {
          case FlightProvider.Mystifly: {
            return new MystiflyFlightsPaymongoEventProcess(
              this.loggerService,
              this.utilsService,
              this.nestMailerService,
              this.bookingFlightsService,
              this.mystiflyFlightBookResponsesService,
              this.mystiflyFlightUtilsService,
            );
          }
          default: {
            this.errorHandlerService.internalServerErrorException(
              'No processes for flight provider...',
            );
            break;
          }
        }
        break;
      }

      case Product.Hotels: {
        switch (provider) {
          case HotelProvider.Tbo: {
            return new TboHotelsPaymongoEventProcess(
              this.hotelsService,
              this.tboHotelBookResponsesService,
              this.bookingHotelsService,
              this.nestMailerService,
              this.utilsService,
              // this.paymongoEventsService,
            );
          }
          default: {
            this.errorHandlerService.internalServerErrorException(
              'No processes for hotel provider...',
            );
            break;
          }
        }
        break;
      }

      default: {
        this.errorHandlerService.internalServerErrorException(
          'No processes for product...',
        );
        break;
      }
    }
  }
}

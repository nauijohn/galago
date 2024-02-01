import { Injectable } from '@nestjs/common';

import { HotelProvider } from '../../common/enums/hotel-provider.enum';
import { BookingHotelGateway } from './booking-hotel-gateway.abstract';
import { BookingHotelProcessesGateway } from './booking-hotel-processes.gateway';
import { AbstractProcessHotelBookingDto } from './dtos/abstract-process-hotel-booking.dto';

@Injectable()
export class BookingHotelProcessesService {
  private readonly bookingHotelGateways: Record<string, BookingHotelGateway> =
    {};

  constructor(
    private readonly bookingHotelProcessesGateway: BookingHotelProcessesGateway,
  ) {}

  async processHotelBooking(
    provider: HotelProvider,
    processHotelBookingDto: AbstractProcessHotelBookingDto,
  ) {
    const prebookingHotelGateway =
      this.bookingHotelProcessesGateway.instantiate(provider);
    this.registerBookingHotelGateway(provider, prebookingHotelGateway);
    return await this.bookingHotelGateways[provider].processHotelBooking(
      processHotelBookingDto,
    );
  }

  private registerBookingHotelGateway(
    provider: HotelProvider,
    gateway: BookingHotelGateway,
  ) {
    this.bookingHotelGateways[provider] = gateway;
  }
}

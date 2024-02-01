import { Injectable } from '@nestjs/common';

import { FlightProvider } from '../../common/enums/flight-provider.enum';
import { BookingFlightGateway } from './booking-flight-gateway.abstract';
import { BookingFlightProcessesGateway } from './booking-flight-processes.gateway';
import { AbstractProcessFlightBookingDto } from './dtos/abstract-process-flight-booking.dto';

@Injectable()
export class BookingFlightProcessesService {
  private readonly bookingFlightGateways: Record<string, BookingFlightGateway> =
    {};

  constructor(
    private readonly bookingFlightProcessesGateway: BookingFlightProcessesGateway,
  ) {}

  async processFlightBooking(
    provider: FlightProvider,
    processFlightBookingDto: AbstractProcessFlightBookingDto,
  ) {
    const prebookingFlightGateway =
      this.bookingFlightProcessesGateway.instantiate(provider);
    this.registerBookingFlightGateway(provider, prebookingFlightGateway);
    return await this.bookingFlightGateways[provider].processFlightBooking(
      processFlightBookingDto,
    );
  }

  private registerBookingFlightGateway(
    provider: FlightProvider,
    gateway: BookingFlightGateway,
  ) {
    this.bookingFlightGateways[provider] = gateway;
  }
}

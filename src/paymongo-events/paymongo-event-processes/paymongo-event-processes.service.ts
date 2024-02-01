import { Injectable } from '@nestjs/common';

import { FlightProvider } from '../../common/enums/flight-provider.enum';
import { HotelProvider } from '../../common/enums/hotel-provider.enum';
import { Product } from '../../common/enums/product.enum';
import { AbstractProcessPaymongoEventDto } from './dtos/abstract-process-paymongo-event.dto';
import { PaymongoEventGateway } from './paymongo-event-gateway.abstract';
import { PaymongoEventProcessesGateway } from './paymongo-event-processes.gateway';

@Injectable()
export class PaymongoEventProcessesService {
  private readonly paymongoEventProcessGateways: Record<
    string,
    PaymongoEventGateway
  > = {};

  constructor(
    private readonly paymongoEventProcessesGateway: PaymongoEventProcessesGateway,
  ) {}

  async processPaymongoEvent(
    product: Product,
    provider: FlightProvider | HotelProvider,
    processPaymongoEventDto: AbstractProcessPaymongoEventDto,
  ) {
    const paymongoEventProcessGateway =
      this.paymongoEventProcessesGateway.instantiate(product, provider);

    this.registerPaymongoEventGateway(
      product,
      provider,
      paymongoEventProcessGateway,
    );

    return await this.paymongoEventProcessGateways[
      `${product}-${provider}`
    ].processPaymongoEvent(processPaymongoEventDto);
  }

  private registerPaymongoEventGateway(
    product: Product,
    provider: FlightProvider | HotelProvider,
    gateway: PaymongoEventGateway,
  ) {
    this.paymongoEventProcessGateways[`${product}-${provider}`] = gateway;
  }
}

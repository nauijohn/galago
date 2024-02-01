import { Injectable } from '@nestjs/common';

import { FlightProvider } from '../../common/enums/flight-provider.enum';
import { AbstractProcessFlightPrebookingDto } from './dtos/abstract-process-flight-prebooking.dto';
import { PrebookingFlightGateway } from './prebooking-flight-gateway.abstract';
import { PrebookingFlightProcessGateway } from './prebooking-flight-processes.gateway';

@Injectable()
export class PrebookingFlightProcessesService {
  private readonly prebookingFlightGateways: Record<
    string,
    PrebookingFlightGateway
  > = {};

  constructor(
    private readonly prebookingFlightProcessGateway: PrebookingFlightProcessGateway,
  ) {}

  public async processFlightPrebooking(
    provider: FlightProvider,
    processFlightPrebookingDto: AbstractProcessFlightPrebookingDto,
  ) {
    console.log('provider: ', provider);
    console.log('processFlightPrebookingDto: ', processFlightPrebookingDto);

    const prebookingFlightGateway =
      this.prebookingFlightProcessGateway.instantiate(provider);

    this.registerPrebookingFlightGateway(provider, prebookingFlightGateway);

    return await this.prebookingFlightGateways[
      provider
    ].processFlightPrebooking(processFlightPrebookingDto);
  }

  private registerPrebookingFlightGateway(
    provider: FlightProvider,
    gateway: PrebookingFlightGateway,
  ) {
    this.prebookingFlightGateways[provider] = gateway;
  }
}

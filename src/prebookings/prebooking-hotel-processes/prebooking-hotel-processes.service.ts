import { Injectable } from '@nestjs/common';

import { HotelProvider } from '../../common/enums/hotel-provider.enum';
import { AbstractProcessHotelPrebookingDto } from './dtos/abstract-process-hotel-prebooking.dto';
import { PrebookingHotelGateway } from './prebooking-hotel-gateway.abstract';
import { PrebookingHotelProcessGateway } from './prebooking-hotel-processes.gateway';

@Injectable()
export class PrebookingHotelProcessesService {
  private readonly prebookingHotelGateways: Record<
    string,
    PrebookingHotelGateway
  > = {};

  constructor(
    private readonly prebookingHotelProcessGateway: PrebookingHotelProcessGateway,
  ) {}

  public async processHotelPrebooking(
    provider: HotelProvider,
    processHotelPrebookingDto: AbstractProcessHotelPrebookingDto,
  ) {
    console.log('provider: ', provider);
    console.log('processHotelPrebookingDto: ', processHotelPrebookingDto);

    const prebookingHotelGateway =
      this.prebookingHotelProcessGateway.instantiate(provider);

    this.registerPrebookingHotelGateway(provider, prebookingHotelGateway);

    return await this.prebookingHotelGateways[provider].processHotelPrebooking(
      processHotelPrebookingDto,
    );
  }

  private registerPrebookingHotelGateway(
    provider: HotelProvider,
    gateway: PrebookingHotelGateway,
  ) {
    this.prebookingHotelGateways[provider] = gateway;
  }
}

import { AbstractProcessPaymongoEventDto } from './dtos/abstract-process-paymongo-event.dto';

export abstract class PaymongoEventGateway {
  abstract processPaymongoEvent(
    abstractProcessPaymongoEventDto: AbstractProcessPaymongoEventDto,
  ): Promise<void>;
}

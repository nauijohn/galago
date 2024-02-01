import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { PrebookingFlight } from '../../../prebookings/prebooking-flights/prebooking-flight.entity';
import {
  MystiflyRevalidationDataError,
  MystiflyRevalidationExtraServices,
  MystiflyRevalidationPricedItineraries,
} from '../flight-utils/dtos/response/mystifly-revalidation-response.dto';

@Entity({ name: 'mystifly_flight_revalidation_responses' })
export class MystiflyFlightRevalidationResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column({ type: 'json', nullable: true })
  @AutoMap(() => Array<MystiflyRevalidationPricedItineraries>)
  pricedItineraries: MystiflyRevalidationPricedItineraries[];

  @Column({ nullable: true })
  @AutoMap()
  conversationId: string;

  @Column({ type: 'json', nullable: true })
  @AutoMap(() => Array<MystiflyRevalidationDataError>)
  errors: MystiflyRevalidationDataError[];

  @Column({ type: 'json', nullable: true })
  @AutoMap(() => Array<MystiflyRevalidationExtraServices>)
  extraServices: MystiflyRevalidationExtraServices[];

  @Column({ nullable: true })
  @AutoMap()
  traceId: string;

  @Column({ nullable: true })
  @AutoMap()
  isValidReason: string;

  @Column({ nullable: true })
  providerReference: string;

  @Column({ type: 'int', nullable: true })
  sequence: number;

  @ManyToOne(
    () => PrebookingFlight,
    (prebookingFlight) => prebookingFlight.mystiflyFlightRevalidationResponses,
    {
      eager: false,
      cascade: false,
      onDelete: 'CASCADE',
    },
  )
  prebookingFlight: PrebookingFlight;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}

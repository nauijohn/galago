import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import {
  FlightFares,
  OriginDestinations,
  PenaltiesInfo,
} from '../flight-utils/dtos/response/mystifly-search-response.dto';

@Entity({ name: 'mystifly_flight_details' })
export class MystiflyFlightDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  @AutoMap()
  fareSourceCode: string;

  @Column()
  @AutoMap()
  validatingCarrier: string;

  @Column({ type: 'json' })
  @AutoMap(() => Array<OriginDestinations>)
  originDestinations: OriginDestinations[];

  @Column({ type: 'json' })
  @AutoMap(() => FlightFares)
  flightFares: FlightFares;

  @Column({ type: 'json' })
  @AutoMap(() => PenaltiesInfo)
  penaltiesInfo: PenaltiesInfo;

  @Column()
  providerReference: string;

  @Column()
  paymentReferenceNumber: string;

  @Column({ type: 'int', nullable: true })
  sequence: number;

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

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { MystiflyBookDataError } from '../flight-utils/dtos/response/mystifly-book-response.dto';

@Entity({ name: 'mystifly_flight_book_responses' })
export class MystiflyFlightBookResponse {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ nullable: true })
  @AutoMap()
  userId: string;

  @Column()
  @AutoMap()
  clientUTCOffset: number;

  @Column()
  @AutoMap()
  conversationId: string;

  @Column({ type: 'json', nullable: true })
  @AutoMap(() => Array<MystiflyBookDataError>)
  errors: MystiflyBookDataError[];

  @Column()
  @AutoMap()
  status: string;

  @Column({ nullable: true })
  @AutoMap()
  tktTimeLimit: string;

  @Column()
  @AutoMap()
  traceId: string;

  @Column()
  @AutoMap()
  uniqueID: string;

  @Column()
  @AutoMap()
  providerReference: string;

  @Column()
  @AutoMap()
  paymentReferenceNumber: string;

  @Column({ type: 'int', nullable: true })
  @AutoMap()
  sequence: number;

  @Column({ nullable: true })
  @AutoMap()
  fareSourceCode: string;

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

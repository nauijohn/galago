import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

@Entity({ name: 'tbo_hotel_book_responses' })
export class TboHotelBookResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @AutoMap()
  userId: string;

  @Column({ nullable: true })
  @AutoMap()
  clientReferenceId: string;

  @Column({ nullable: true })
  @AutoMap()
  confirmationNumber: string;

  @Column({ nullable: true })
  @AutoMap()
  providerReference: string;

  @Column({ nullable: true })
  @AutoMap()
  paymentReferenceNumber: string;

  @Column({ nullable: true })
  @AutoMap()
  message: string;

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

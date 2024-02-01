import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { PaymentStatus } from '../payment-status.enum';

@Entity({ name: 'payment_hotels' })
export class PaymentHotel {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column()
  @AutoMap()
  name: string;

  @Column({ type: 'double precision', nullable: true })
  @AutoMap()
  amount: number;

  @Column({ nullable: true })
  @AutoMap()
  discount?: number;

  @Column()
  @AutoMap()
  status: PaymentStatus;

  @Column({ unique: true })
  @AutoMap()
  referenceNumber: string;

  @Column({ unique: true })
  @AutoMap()
  paymentIntentId: string;

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

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { PaymentStatus } from '../payment-status.enum';

@Entity({ name: 'payment_flights' })
export class PaymentFlight {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  @AutoMap()
  name: string;

  @Column({ unique: true })
  @AutoMap()
  referenceNumber: string;

  @Column({ unique: true })
  @AutoMap()
  paymentIntentId: string;

  @Column({ type: 'varchar', nullable: true, array: true })
  promoCodes: string[];

  @Column({ type: 'double precision', nullable: true })
  @AutoMap()
  amount: number;

  @Column({ type: 'double precision', nullable: true })
  discountAmount: number;

  @Column({ type: 'double precision', nullable: true })
  originalAmount: number;

  @Column({ type: 'double precision', nullable: true })
  paidAmount: number;

  @Column()
  status: PaymentStatus;

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

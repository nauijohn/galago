import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

@Entity({ name: 'promo_codes' })
export class PromoCode {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ unique: true })
  @AutoMap()
  promoCode: string;

  @Column({ nullable: true, type: 'date' })
  @AutoMap()
  fromDate: string;

  @Column({ type: 'date' })
  @AutoMap()
  toDate: string;

  @Column()
  @AutoMap()
  isEnabled: boolean;

  @Column({ nullable: true })
  @AutoMap()
  maxUse: number;

  @Column({ type: 'double precision' })
  @AutoMap()
  percentage: number;

  @Column({ type: 'double precision' })
  @AutoMap()
  fixedAmount: number;

  @Column()
  @AutoMap()
  priceMargin: string;

  @Column({ nullable: true })
  @AutoMap()
  type: string;

  @Column({ nullable: true })
  @AutoMap()
  description: string;

  @Column({ nullable: true })
  @AutoMap()
  isMultipleAllowed: boolean;

  @Column({ nullable: true })
  @AutoMap()
  minValueApplied: number;

  @Column({ nullable: true })
  @AutoMap()
  valueCap: number;

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

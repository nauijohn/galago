import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { PriceMargin } from './price-margin.enum';
import { Rating } from './rating.enum';

@Entity({ name: 'pricing_hotels' })
export class PricingHotel {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ type: 'double precision' })
  @AutoMap()
  fixedAmount: number;

  @Column({ type: 'double precision' })
  @AutoMap()
  percentage: number;

  @Column()
  @AutoMap()
  rating: Rating;

  @Column()
  @AutoMap()
  priceMargin: PriceMargin;

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

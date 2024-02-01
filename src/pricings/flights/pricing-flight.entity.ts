import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { IataCode } from '../../iataCodes/iata-code.entity';
import { CabinClass } from './cabin-class.enum';
import { PriceMargin } from './price-margin.enum';

@Entity({ name: 'pricing_flights' })
export class PricingFlight {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => IataCode, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @AutoMap(() => IataCode)
  iataCode: IataCode;

  @Column({ type: 'float' })
  @AutoMap()
  fixedAmount: number;

  @Column({ type: 'float' })
  @AutoMap()
  percentage: number;

  @Column()
  @AutoMap()
  cabinClass: CabinClass;

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

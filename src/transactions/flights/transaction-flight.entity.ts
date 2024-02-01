import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { BookingFlight } from '../../bookings/booking-flights/booking-flight.entity';
import { FlightType } from '../../common/enums/flight-type.enum';
import { PaymentFlight } from '../../payments/payment-flights/payment-flight.entity';
import { PrebookingFlight } from '../../prebookings/prebooking-flights/prebooking-flight.entity';

@Entity({ name: 'transaction_flights' })
export class TransactionFlight {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  flightReference: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  transactionId: string;

  @Column()
  @AutoMap()
  origin: string;

  @Column()
  @AutoMap()
  destination: string;

  @Column({ type: 'date' })
  @AutoMap()
  departureDate: Date;

  @Column({ type: 'date', nullable: true })
  @AutoMap()
  returnDate?: Date;

  @Column()
  @AutoMap()
  adults: number;

  @Column({ nullable: true })
  @AutoMap()
  children: number;

  @Column({ nullable: true })
  @AutoMap()
  infants: number;

  @Column()
  @AutoMap()
  cabinClass: string;

  @Column()
  @AutoMap()
  flightType: FlightType;

  @OneToOne(() => PrebookingFlight, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @AutoMap(() => PrebookingFlight)
  prebookingFlight: PrebookingFlight;

  @OneToMany(
    () => BookingFlight,
    (bookingFlight) => bookingFlight.transactionFlight,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @AutoMap(() => [BookingFlight])
  bookingFlights: BookingFlight[];

  @OneToOne(() => PaymentFlight, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @AutoMap(() => PaymentFlight)
  paymentFlight: PaymentFlight;

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

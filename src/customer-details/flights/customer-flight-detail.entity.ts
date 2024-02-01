import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { BookingFlight } from '../../bookings/booking-flights/booking-flight.entity';

@Entity({ name: 'customer_flight_details' })
export class CustomerFlightDetail {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ nullable: true })
  userId?: string | null;

  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  email: string;

  @Column({ nullable: true })
  @AutoMap()
  mobileNumber?: string | null;

  @OneToMany(
    () => BookingFlight,
    (bookingFlight) => bookingFlight.customerFlightDetail,
  )
  bookingFlights: BookingFlight[];

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

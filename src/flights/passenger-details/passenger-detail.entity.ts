import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { BookingFlight } from '../../bookings/booking-flights/booking-flight.entity';

@Entity({ name: 'passenger_details' })
export class PassengerDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId?: string | null;

  @Column()
  @AutoMap()
  firstName: string;

  @Column()
  @AutoMap()
  lastName: string;

  @Column({ nullable: true })
  @AutoMap()
  middleName?: string | null;

  @Column()
  @AutoMap()
  title: string;

  @Column({ nullable: true })
  @AutoMap()
  nationality?: string | null;

  @Column()
  @AutoMap()
  birthDate: string;

  @Column({ nullable: true })
  @AutoMap()
  passportNumber?: string | null;

  @Column({ nullable: true })
  @AutoMap()
  expirationDate?: string | null;

  @Column({ nullable: true })
  @AutoMap()
  countryIssued?: string | null;

  @Column({ nullable: true, default: 'ADT' })
  passengerType?: string | null;

  @ManyToMany(
    () => BookingFlight,
    (bookingFlight) => bookingFlight.passengerDetails,
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

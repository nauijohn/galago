import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { FlightProvider } from '../../common/enums/flight-provider.enum';
import { FlightType } from '../../common/enums/flight-type.enum';
import { CustomerFlightDetail } from '../../customer-details/flights/customer-flight-detail.entity';
import { PassengerDetail } from '../../flights/passenger-details/passenger-detail.entity';
import { MystiflyFlightBookResponse } from '../../providers/mystifly/flight-book-responses/mystifly-flight-book-response.entity';
import { MystiflyFlightDetail } from '../../providers/mystifly/flight-details/mystifly-flight-detail.entity';
import { TransactionFlight } from '../../transactions/flights/transaction-flight.entity';

@Entity({ name: 'booking_flights' })
export class BookingFlight {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  flightReference: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  @AutoMap()
  origin: string;

  @Column()
  @AutoMap()
  destination: string;

  @Column({ type: 'date', nullable: true })
  @AutoMap()
  departureDate: Date;

  @Column({ type: 'date', nullable: true })
  @AutoMap()
  returnDate: Date;

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
  provider: FlightProvider;

  @Column()
  flightType: FlightType;

  @Column()
  providerReference: string;

  @Column({ nullable: true })
  sequence: number;

  @OneToOne(() => MystiflyFlightDetail, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  mystiflyFlightDetail: MystiflyFlightDetail;

  @ManyToMany(
    () => PassengerDetail,
    (passengerDetail) => passengerDetail.bookingFlights,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinTable({ name: 'passenger_detail_booking_flights_booking_flight' })
  passengerDetails: PassengerDetail[];

  @ManyToOne(() => CustomerFlightDetail, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  customerFlightDetail: CustomerFlightDetail;

  @ManyToOne(
    () => TransactionFlight,
    (transactionFlight) => transactionFlight.bookingFlights,
    {
      eager: false,
      cascade: false,
      onDelete: 'CASCADE',
    },
  )
  transactionFlight: TransactionFlight;

  @OneToOne(() => MystiflyFlightBookResponse, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @AutoMap(() => MystiflyFlightBookResponse)
  mystiflyFlightBookResponse: MystiflyFlightBookResponse;

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

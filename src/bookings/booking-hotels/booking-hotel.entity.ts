import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { HotelProvider } from '../../common/enums/hotel-provider.enum';
import { CustomerHotelDetail } from '../../customer-details/hotels/customer-hotel-detail.entity';
import { TboHotelBookResponse } from '../../providers/tbo/hotel-book-responses/tbo-hotel-book-response.entity';
import { TboHotelDetail } from '../../providers/tbo/hotel-details/tbo-hotel-detail.entity';
import { TransactionHotel } from '../../transactions/hotels/transaction-hotel.entity';

@Entity({ name: 'booking_hotels' })
export class BookingHotel {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column({ type: 'date' })
  @AutoMap()
  checkInDate: Date;

  @Column({ type: 'date' })
  @AutoMap()
  checkOutDate: Date;

  @Column({ nullable: true })
  adults: number;

  @Column({ nullable: true })
  children: number;

  @Column()
  @AutoMap()
  provider: HotelProvider;

  @Column({ nullable: true })
  providerReference: string;

  @ManyToOne(
    () => TransactionHotel,
    (transactionHotel) => transactionHotel.bookingHotels,
    {
      eager: false,
      cascade: false,
      onDelete: 'CASCADE',
    },
  )
  transactionHotel: TransactionHotel;

  @ManyToOne(() => CustomerHotelDetail, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  customerHotelDetail: CustomerHotelDetail;

  @OneToOne(() => TboHotelDetail, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tboHotelDetail: TboHotelDetail;

  @OneToOne(() => TboHotelBookResponse, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @AutoMap(() => TboHotelBookResponse)
  tboHotelBookResponse: TboHotelBookResponse;

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

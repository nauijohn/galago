import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { PrebookingHotel } from '../../../prebookings/prebooking-hotels/prebooking-hotel.entity';
import { TboRooms } from '../hotel-utils/hotels/dtos/response/tbo-search-hotels-response.dto';

@Entity({ name: 'tbo_hotel_prebook_responses' })
export class TboHotelPrebookResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  @AutoMap()
  hotelCode: string;

  @Column()
  @AutoMap()
  currency: string;

  @Column({ type: 'json' })
  @AutoMap(() => [TboRooms])
  rooms: TboRooms[];

  @Column({ type: 'json' })
  @AutoMap(() => Array<string>)
  rateConditions: string[];

  @ManyToOne(
    () => PrebookingHotel,
    (prebookingHotel) => prebookingHotel.tboHotelPrebookResponses,
    {
      eager: false,
      cascade: false,
      onDelete: 'CASCADE',
    },
  )
  prebookingHotel: PrebookingHotel;

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

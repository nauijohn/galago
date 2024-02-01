import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

@Entity({ name: 'scrappings_tbo_hotels' })
// @Unique(['hotelCode', 'hotelName'])
export class ScrappingsTboHotel {
  @ObjectIdColumn()
  @AutoMap()
  id: string;

  @Column()
  @AutoMap()
  hotelCode: string;

  @Column()
  @AutoMap()
  hotelName: string;

  @Column()
  @AutoMap()
  hotelRating: string;

  @Column()
  @AutoMap()
  address: string;

  @Column({ type: 'json' })
  @AutoMap(() => Array<string>)
  attractions: string[];

  @Column()
  @AutoMap()
  countryName: string;

  @Column()
  @AutoMap()
  countryCode: string;

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  faxNumber: string;

  @Column({ type: 'json' })
  @AutoMap(() => Array<string>)
  hotelFacilities: string[];

  @Column()
  @AutoMap()
  map: string;

  @Column()
  @AutoMap()
  phoneNumber: string;

  @Column()
  @AutoMap()
  pinCode: string;

  @Column()
  @AutoMap()
  hotelWebsiteUrl: string;

  @Column()
  @AutoMap()
  cityName: string;

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

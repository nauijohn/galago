import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { MystiflySearch } from '../../../providers/mystifly/flight-utils/dtos/response/mystifly-search-response.dto';

@Entity({ name: 'analytics_search_flights' })
export class AnalyticsSearchFlight {
  @ObjectIdColumn()
  @AutoMap()
  id: string;

  @Column()
  @AutoMap(() => Array<MystiflySearch>)
  economy: MystiflySearch[];

  @Column()
  @AutoMap(() => Array<MystiflySearch>)
  business: MystiflySearch[];

  @Column()
  @AutoMap(() => Array<MystiflySearch>)
  first: MystiflySearch[];

  @Column()
  @AutoMap(() => Array<MystiflySearch>)
  premiumEconomy: MystiflySearch[];

  @Column()
  @AutoMap()
  provider: string;

  @Column()
  @AutoMap()
  flightType: string;

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

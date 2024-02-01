import { HydratedDocument, Types } from 'mongoose';

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AirportListDocument = HydratedDocument<AirportList>;

@Schema({ collection: 'airportlistv1' })
export class AirportList {
  @AutoMap()
  _id: Types.ObjectId;

  @Prop({ type: String })
  @AutoMap()
  airportCode: string;

  @Prop({ type: String })
  @AutoMap()
  airportName: string;

  @Prop({ type: String })
  @AutoMap()
  cityCode: string;

  @Prop({ type: String })
  @AutoMap()
  cityName: string;

  @Prop({ type: String })
  @AutoMap()
  countryName: string;

  @Prop({ type: String })
  @AutoMap()
  countryCode: string;
}

export const AirportListSchema = SchemaFactory.createForClass(AirportList);

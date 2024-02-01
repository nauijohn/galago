import { HydratedDocument, Types } from 'mongoose';

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type HotelListDocument = HydratedDocument<HotelList>;

@Schema({ collection: 'hotellistv1' })
export class HotelList {
  @AutoMap()
  _id: Types.ObjectId;

  @Prop({ type: String })
  @AutoMap()
  HotelCode: string;

  @Prop({ type: String })
  @AutoMap()
  HotelName: string;

  @Prop({ type: String })
  @AutoMap()
  HotelRating: string;

  @Prop({ type: String })
  @AutoMap()
  Address: string;

  @Prop({ type: Array<String> })
  @AutoMap(() => Array<string>)
  Attractions: string[];

  @Prop({ type: String })
  @AutoMap()
  CountryName: string;

  @Prop({ type: String })
  @AutoMap()
  CountryCode: string;

  @Prop({ type: String })
  @AutoMap()
  Description: string;

  @Prop({ type: String })
  @AutoMap()
  FaxNumber: string;

  @Prop({ type: Array<String> })
  @AutoMap(() => Array<string>)
  HotelFacilities: string[];

  @Prop({ type: String })
  @AutoMap()
  Map: string;

  @Prop({ type: String })
  @AutoMap()
  PhoneNumber: string;

  @Prop({ type: String })
  @AutoMap()
  PinCode: string;

  @Prop({ type: String })
  @AutoMap()
  HotelWebsiteUrl: string;

  @Prop({ type: String })
  @AutoMap()
  CityName: string;
}

export const HotelListSchema = SchemaFactory.createForClass(HotelList);

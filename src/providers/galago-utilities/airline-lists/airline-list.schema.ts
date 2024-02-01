import { HydratedDocument, Types } from 'mongoose';

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AirlineListDocument = HydratedDocument<AirlineList>;

@Schema({ collection: 'airlinelistv1' })
export class AirlineList {
  @AutoMap()
  _id: Types.ObjectId;

  @Prop({ type: String })
  @AutoMap()
  code: string;

  @Prop({ type: String })
  @AutoMap()
  descriptions: string;
}

export const AirlineListSchema = SchemaFactory.createForClass(AirlineList);

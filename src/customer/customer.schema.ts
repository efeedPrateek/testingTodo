import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';
import { ulid } from 'ulid';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  // @Prop({})
  _id: string;

  @Prop({ default: ulid() })
  uuid: string;

  @Prop({ default: '' })
  firstName: string;

  @Prop({})
  lastName: string;

  @Prop({ maxlength: 10, unique: true })
  mobile: string;

  @Prop({ default: false })
  isActive: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { ulid } from 'ulid';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  _id: string;

  @Prop({ default: ulid() })
  uuid: string;

  @Prop({ default: '' })
  firstName: string;

  @Prop({})
  lastName: string;

  @Prop({ maxlength: 10 })
  mobile: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

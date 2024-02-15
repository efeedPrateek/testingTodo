import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ulid } from 'ulid';
import { UserRole } from './role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // @Prop({})
  _id: string;

  @Prop({ default: ulid() })
  uuid: string;

  @Prop({})
  name: string;

  @Prop({ type: String, maxlength: 10 })
  mobile: string;

  @Prop({ type: String, maxlength: 4 })
  otp: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({ default: '' })
  token: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

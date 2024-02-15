import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.schema';
import { ulid } from 'ulid';

export type TodoTaskDocument = TodoTask & Document;

@Schema({ timestamps: true })
export class TodoTask {
  // @Prop({})
  _id: string;
  @Prop()
  text: string;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  userId: User;
}

export const TodoTaskSchema = SchemaFactory.createForClass(TodoTask);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  @IsNotEmpty()
  name: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop()
  preferences: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

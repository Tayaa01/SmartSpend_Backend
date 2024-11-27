import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema()
export class Budget extends Document {
  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  period: string;

  @Prop({ required: true })
  savings: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Budget extends Document {
  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  period: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);

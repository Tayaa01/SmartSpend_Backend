import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../../category/schemas/category.Schema'; // Update the import path based on your folder structure
import { User } from '../../user/schemas/user.schema';

@Schema()
export class Expense extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId; // This links to the Category schema

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../../category/schemas/category.Schema'; // Ensure correct import path
import { User } from '../../user/schemas/user.schema';
import { BillDetail, BillDetailSchema } from './bill-detail.schema';

@Schema()
export class Expense extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: Date;

  // Linking the 'category' field to the 'Category' schema
  @Prop({ type: Types.ObjectId, ref: 'Category', required: false })
  category: Types.ObjectId; // References the Category model

  // Linking the 'user' field to the 'User' schema
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [BillDetailSchema], required: false, default: [] })
  billDetails?: BillDetail[];
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

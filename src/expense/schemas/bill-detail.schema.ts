
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BillDetail extends Document {
  @Prop()
  description: string;

  @Prop({ default: 1 })
  quantity: number;

  @Prop({ default: 0 })
  price: number;
}

export const BillDetailSchema = SchemaFactory.createForClass(BillDetail);
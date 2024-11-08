import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Report extends Document {
  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  user: string;

  @Prop()
  summaryContent: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

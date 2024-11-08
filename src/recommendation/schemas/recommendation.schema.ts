import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Recommendation extends Document {
  @Prop({ required: true })
  advice: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  user: string;
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);

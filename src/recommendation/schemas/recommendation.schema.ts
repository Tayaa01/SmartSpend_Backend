import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Add export keyword here
export interface Suggestion {
  category: string;
  advice: string;
}

@Schema()
export class Recommendation extends Document {
  @Prop({ required: true, type: [Object] })
  suggestions: Suggestion[];

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  date: Date;
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Recommendation extends Document {
  @Prop({ type: String, required: true })
  recommendationText: string; // The AI-generated recommendation text

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // Reference to the User who owns this recommendation

  @Prop({ type: Date, required: true })
  date: Date; // The date when the recommendation was generated
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);

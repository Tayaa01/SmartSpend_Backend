import { Document } from 'mongoose';
export declare class Recommendation extends Document {
    advice: string;
    date: Date;
    user: string;
}
export declare const RecommendationSchema: import("mongoose").Schema<Recommendation, import("mongoose").Model<Recommendation, any, any, any, Document<unknown, any, Recommendation> & Recommendation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Recommendation, Document<unknown, {}, import("mongoose").FlatRecord<Recommendation>> & import("mongoose").FlatRecord<Recommendation> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

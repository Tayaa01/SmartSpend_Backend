import { Document } from 'mongoose';
export declare class Report extends Document {
    createdDate: Date;
    user: string;
    summaryContent: string;
}
export declare const ReportSchema: import("mongoose").Schema<Report, import("mongoose").Model<Report, any, any, any, Document<unknown, any, Report> & Report & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Report, Document<unknown, {}, import("mongoose").FlatRecord<Report>> & import("mongoose").FlatRecord<Report> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

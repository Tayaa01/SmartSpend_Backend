import { Document } from 'mongoose';
export declare class Budget extends Document {
    totalAmount: number;
    category: string;
    period: string;
}
export declare const BudgetSchema: import("mongoose").Schema<Budget, import("mongoose").Model<Budget, any, any, any, Document<unknown, any, Budget> & Budget & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Budget, Document<unknown, {}, import("mongoose").FlatRecord<Budget>> & import("mongoose").FlatRecord<Budget> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

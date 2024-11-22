import { Document } from 'mongoose';
export declare class Expense extends Document {
    amount: number;
    description: string;
    date: Date;
    category: string;
    source: string;
}
export declare const ExpenseSchema: import("mongoose").Schema<Expense, import("mongoose").Model<Expense, any, any, any, Document<unknown, any, Expense> & Expense & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, import("mongoose").FlatRecord<Expense>> & import("mongoose").FlatRecord<Expense> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

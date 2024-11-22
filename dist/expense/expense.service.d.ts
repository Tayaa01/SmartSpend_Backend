import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpenseService {
    create(createExpenseDto: CreateExpenseDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateExpenseDto: UpdateExpenseDto): string;
    remove(id: number): string;
}

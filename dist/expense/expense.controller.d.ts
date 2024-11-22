import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    create(createExpenseDto: CreateExpenseDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateExpenseDto: UpdateExpenseDto): string;
    remove(id: string): string;
}

import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetService {
    create(createBudgetDto: CreateBudgetDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateBudgetDto: UpdateBudgetDto): string;
    remove(id: number): string;
}

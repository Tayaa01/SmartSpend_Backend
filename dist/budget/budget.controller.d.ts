import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
    create(createBudgetDto: CreateBudgetDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateBudgetDto: UpdateBudgetDto): string;
    remove(id: string): string;
}

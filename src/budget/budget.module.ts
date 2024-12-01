import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Budget, BudgetSchema } from './schemas/budget.schema';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { IncomeModule } from '../income/income.module'; // Ensure IncomeModule is imported
import { ExpenseModule } from '../expense/expense.module'; // Ensure ExpenseModule is imported
import { AuthModule } from 'src/auth/auth.module'; // Ensure AuthModule is imported

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
    IncomeModule,  // Import IncomeModule here
    ExpenseModule, // Import ExpenseModule here
    AuthModule,    // Import AuthModule here
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService], // Export BudgetService
})
export class BudgetModule {}

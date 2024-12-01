import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { Recommendation, RecommendationSchema } from './schemas/recommendation.schema';
import { ExpenseModule } from '../expense/expense.module'; // Import ExpenseModule
import { IncomeModule } from '../income/income.module'; // Import IncomeModule
import { CategoryModule } from 'src/category/category.module'; // Import CategoryModule
import { BudgetModule } from 'src/budget/budget.module'; // Import BudgetModule
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recommendation.name, schema: RecommendationSchema }, // Register Recommendation schema
    ]),
    ExpenseModule, // Ensure ExpenseModule is imported here
    IncomeModule,
    CategoryModule, // Ensure CategoryModule is imported here
    BudgetModule,
    AuthModule, // Ensure BudgetModule is imported here
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService], // No need to manually add CategoryService or BudgetService
})
export class RecommendationModule {}

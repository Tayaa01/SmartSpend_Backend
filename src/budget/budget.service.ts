// src/budget/budget.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './schemas/budget.schema'; // Budget schema
import { IncomeService } from '../income/income.service'; // Inject IncomeService
import { ExpenseService } from '../expense/expense.service'; // Inject ExpenseService

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    private readonly incomeService: IncomeService,
    private readonly expenseService: ExpenseService,
  ) {}

  // Get budget for a specific user and period
  async getBudgetForMonth(userId: string, period: string): Promise<Budget> {
    const totalIncome = await this.incomeService.getTotalIncomeByUserAndPeriod(userId, period);
    const totalExpense = await this.expenseService.getTotalExpensesByUserAndPeriod(userId, period);

    const savings = totalIncome - totalExpense;

    // The budget is calculated as the difference between income and expenses
    const budget = new this.budgetModel({
      Budget: totalIncome - totalExpense,
      period,
      savings,
      user: userId,
    });

    return budget.save();
  }
}

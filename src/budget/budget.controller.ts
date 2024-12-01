// src/budget/budget.controller.ts
import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { Budget } from './schemas/budget.schema';
import { AuthService } from 'src/auth/auth.service'; // Inject AuthService

@Controller('budget')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly authService: AuthService, // Inject AuthService to get current user from token
  ) {}

  // Get budget for a specific user and period
  @Get()
  async getBudget(
    @Query('token') token: string, // Accept token as query parameter
    @Query('period') period: string, // Accept period (month) as query parameter
  ): Promise<Budget> {
    const user = await this.authService.getCurrentUser(token); // Get current user from token
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.budgetService.getBudgetForMonth(user.id, period); // Get budget for the user and period
  }
}

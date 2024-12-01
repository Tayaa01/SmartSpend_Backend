import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recommendation } from './schemas/recommendation.schema';
import { BudgetService } from '../budget/budget.service';
import { ExpenseService } from '../expense/expense.service';
import { IncomeService } from '../income/income.service';
import { CategoryService } from '../category/category.service';
import { AuthService } from '../auth/auth.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class RecommendationService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectModel(Recommendation.name) private recommendationModel: Model<Recommendation>,
    private budgetService: BudgetService,
    private expenseService: ExpenseService,
    private incomeService: IncomeService,
    private categoryService: CategoryService,
    private authService: AuthService, // Inject AuthService
  ) {
    // Initialize GoogleGenerativeAI with your API key
    this.genAI = new GoogleGenerativeAI("AIzaSyAZ7jUxSLBt9hWXQz6D0MRhMZ8jllfY9ss"); // Replace with your actual API key
  }

  // Method to generate AI-based recommendations
  async generateRecommendation(userToken: string, period: string): Promise<Recommendation> {
    // Use AuthService to get the current user
    const currentUser = await this.authService.getCurrentUser(userToken);

    if (!currentUser || !currentUser.id) {
      throw new Error('Invalid user token or user not found');
    }

    const userId = currentUser.id;

    // Fetch user's data
    const totalIncome = await this.incomeService.getTotalIncomeByUserAndPeriod(userId, period);
    const totalExpenses = await this.expenseService.getTotalExpensesByUserAndPeriod(userId, period);
    const budget = await this.budgetService.getBudgetForMonth(userId, period);
    const expenseCategories = await this.categoryService.getAllExpenseCategories();

    const remainingBudget = totalIncome - totalExpenses;

    // Prepare the AI input prompt
    const aiPrompt = `
      Based on the following information for the user, suggest how they can better allocate their remaining budget:

      Income: ${totalIncome}
      Total Expenses: ${totalExpenses}
      Remaining Budget: ${remainingBudget}
      Categories of spending: ${expenseCategories.join(', ')}

      Categories like 'housing', 'groceries', and 'health care' are mandatory and should not be reduced. Suggest how the user can reduce spending in other categories.
      give simple and actionable recommendations to help the user save money and improve their financial health.
      i want 2 sentence response that is easy to understand and implement.
    `;

    // Call the Google Gemini API for recommendation
    const recommendationText = await this.getAIRecommendation(aiPrompt);

    // Save the recommendation to the database
    try {
      const recommendation = new this.recommendationModel({
        recommendationText,
        user: userId,
        date: new Date(),
      });

      await recommendation.save();
      return recommendation;
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw new Error('Failed to save recommendation');
    }
  }

  // Method to get AI recommendation (using Google Gemini API)
  private async getAIRecommendation(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text(); // Extract and return the AI response text
    } catch (error) {
      console.error('Error fetching AI recommendation:', error);
      return 'Error generating recommendation';
    }
  }
}

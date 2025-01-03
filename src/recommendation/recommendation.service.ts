import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recommendation, Suggestion } from './schemas/recommendation.schema';  // Add Suggestion to import
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
    this.genAI = new GoogleGenerativeAI(process.env.API_KEY); // Replace with your actual API key
  }

  // Method to generate AI-based recommendations
  async generateRecommendation(userToken: string): Promise<Recommendation> {
    const currentUser = await this.authService.getCurrentUser(userToken);
    if (!currentUser || !currentUser.id) {
      throw new Error('Invalid user token or user not found');
    }

    const userId = currentUser.id;
    const totalIncome = await this.incomeService.getTotalIncomeByUser(userId);
    const totalExpenses = await this.expenseService.getTotalExpensesByUser(userId);
    const expenseCategories = await this.categoryService.getAllExpenseCategories();
    const remainingBudget = totalIncome - totalExpenses;
    const expenseRatio = totalExpenses / totalIncome;

    const isFinanciallyHealthy = expenseRatio < 0.7; // Less than 70% of income spent

    const aiPrompt = `You are a financial advisor. Generate 4 focused recommendations based on:
    
    Financial Status:
    - Monthly Income: $${totalIncome}
    - Monthly Expenses: $${totalExpenses}
    - Available Budget: $${remainingBudget}
    - Expense Ratio: ${(expenseRatio * 100).toFixed(1)}%
    - Categories: ${expenseCategories.join(', ')}

    ${isFinanciallyHealthy 
      ? "First recommendation MUST start with 'Great job!' and explicitly mention the healthy expense ratio of ${(expenseRatio * 100).toFixed(1)}%. Then provide 3 specific ways to build on this success."
      : "The expense ratio is ${(expenseRatio * 100).toFixed(1)}%, which is high. Provide 4 specific ways to improve spending habits and financial health."}

    Respond with ONLY a JSON array of 4 objects. Each advice should be 10-20 words:
    [
      {
        "category": "Financial Health",
        "advice": "Start with clear status assessment, then give specific actionable advice"
      }
    ]`;

    const suggestions = await this.getAIRecommendation(aiPrompt);
    
    try {
      const recommendation = new this.recommendationModel({
        suggestions,
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
  private async getAIRecommendation(prompt: string): Promise<Suggestion[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt]);
      
      const response = result.response.text();
      console.log('Raw AI Response:', response); // For debugging

      // Clean and parse response
      const cleanedResponse = response
        .replace(/^[\s\S]*?\[/, '[') // Remove everything before first [
        .replace(/\][\s\S]*$/, ']'); // Remove everything after last ]

      const suggestions = JSON.parse(cleanedResponse);

      // Validate response structure
      if (!Array.isArray(suggestions) || suggestions.length !== 4 || 
          !suggestions.every(s => s.category && s.advice)) {
        throw new Error('Invalid response structure');
      }

      return suggestions;
    } catch (error) {
      console.error('AI Response Error:', error);
      throw new Error('Failed to generate valid recommendations');
    }
  }
}

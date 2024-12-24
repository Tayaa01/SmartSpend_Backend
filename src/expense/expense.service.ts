import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './schemas/expense.schema'; // Expense schema
import { CreateExpenseDto } from './dto/create-expense.dto'; // DTO for creating an expense
import { UpdateExpenseDto } from './dto/update-expense.dto'; // DTO for updating an expense
import { CategoryService } from 'src/category/category.service'; // Inject CategoryService
import { AuthService } from 'src/auth/auth.service'; // Inject AuthService
import { GoogleGenerativeAI } from '@google/generative-ai'; // Assuming the Generative AI SDK
import { ConfigService } from '@nestjs/config'; // Assuming ConfigService is used for API key
import { HttpService } from '@nestjs/axios'; // HttpService for network calls
import { Express } from 'express'; // Import Express for Multer file handling
import * as levenshtein from 'fast-levenshtein';

@Injectable()
export class ExpenseService {
  private genAI: any;
  private genAIFlashModel: any;

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private categoryService: CategoryService,
    private authService: AuthService, // Inject AuthService
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    // Initialize the Google Generative AI SDK with the API key from the config
    this.genAI = new GoogleGenerativeAI(process.env.API_KEY);
    this.genAIFlashModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Existing method to get all expenses for a user
  async findAllByUser(userId: string): Promise<Expense[]> {
    return this.expenseModel
      .find({ user: userId })
      .sort({ date: -1 }) // Sort by date in descending order (recent first)
      .exec();
  }

  // Existing method to get a single expense by ID
  async findOne(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseModel.findOne({ _id: id, user: userId }).exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  // Existing method to create an expense
  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const createdExpense = new this.expenseModel(createExpenseDto);
    return createdExpense.save(); // Save the new expense
  }

  // Existing method to update an expense
  async update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string): Promise<Expense> {
    const expense = await this.expenseModel.findOne({ _id: id, user: userId }).exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    Object.assign(expense, updateExpenseDto); // Update expense details
    return expense.save(); // Save the updated expense
  }

  // Existing method to delete an expense
  async remove(id: string, userId: string): Promise<void> {
    const expense = await this.expenseModel.findOne({ _id: id, user: userId }).exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    await this.expenseModel.deleteOne({ _id: id, user: userId }).exec();
  }

  // Existing method to get the total expenses for a user
  async getTotalExpensesByUser(userId: string): Promise<number> {
    const expenses = await this.expenseModel.find({ user: userId }).exec();
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  // Existing method to get total expenses by user and period
  async getTotalExpensesByUserAndPeriod(userId: string, period: string): Promise<number> {
    const startDate = new Date(period);
    startDate.setDate(1); // Set to the first day of the month

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Set to the first day of the next month

    const expenses = await this.expenseModel
      .find({
        user: userId,
        date: { $gte: startDate, $lt: endDate },
      })
      .exec();

    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  /**
 * Scan a bill image and extract details (amount, description, and category).
 * If the category is not matched, default to "Other".
 * @param file - the scanned bill image file (Multer file)
 * @param userId - ID of the user to associate expenses with
 * @returns saved Expense objects
 */
  async scanBill(file: Express.Multer.File, userId: string): Promise<Expense> {
    if (!file) {
      throw new Error('File is required');
    }
  
    const image = {
      inlineData: {
        data: Buffer.from(file.buffer).toString('base64'),
        mimeType: 'image/png',
      },
    };
  
    // Fetch available categories
    const availableCategories = await this.categoryService.getAllExpenseCategories();
    if (!availableCategories || availableCategories.length === 0) {
      throw new Error('No expense categories available in the database');
    }
  
    const categoryNames = availableCategories.map((cat) => cat.name).join(', ');
  
    const prompt = `
      Extract the bill details as an array of JSON objects with fields: amount, description, and category.
      Use these categories: ${categoryNames}.
    `;
  
    // Fetch AI response
    let responseText: string;
    try {
      const result = await this.genAIFlashModel.generateContent([prompt, image]);
      responseText = await (await result.response).text();
  
      // Remove potential artifacts like backticks or extraneous text
      responseText = responseText.replace(/```json|```/g, '').trim();
    } catch (err) {
      console.error('Error calling AI model:', err.message);
      throw new Error('Failed to call AI service');
    }
  
    console.log('Cleaned AI Response:', responseText);
  
    // Parse and validate JSON
    let extractedExpenses: any[];
    try {
      extractedExpenses = JSON.parse(responseText);
  
      if (!Array.isArray(extractedExpenses)) {
        throw new Error('Response is not an array of expenses');
      }
    } catch (err) {
      console.error('Error parsing AI response:', err.message);
      throw new Error('Invalid response from AI service');
    }
  
    let totalAmount = 0;
    const billDetails = [];
    let matchedCategoryId = null;
  
    for (const item of extractedExpenses) {
      const { amount, description, category } = item;
  
      if (!amount || !description || !category) {
        console.warn('Skipping invalid expense item:', item);
        continue;
      }
  
      const matchedCategory =
        availableCategories.find(
          (cat) => cat.name.toLowerCase() === category.toLowerCase()
        ) || availableCategories.find((cat) => cat.name === 'Other');
  
      if (!matchedCategory) {
        throw new Error('Default "Other" category is missing');
      }
      matchedCategoryId = matchedCategory._id;
  
      totalAmount += parseFloat(amount);
      billDetails.push({
        description: description,
        quantity: item.quantity || 1,
        price: parseFloat(item.amount) || 0,
      });
    }
  
    // Generate a brief AI-based description for the entire bill
    let expenseDescription = 'Scanned Bill';
    try {
      const summaryPrompt = `
        Summarize the following items in one short phrase of max 5 words:
        ${JSON.stringify(billDetails)}
      `;
      const descResult = await this.genAIFlashModel.generateContent([summaryPrompt]);
      expenseDescription = (await (await descResult.response).text()).trim() || expenseDescription;
    } catch (err) {
      console.error('Error generating description:', err.message);
    }
  
    const expense = new this.expenseModel({
      amount: totalAmount,
      description: expenseDescription,
      category: matchedCategoryId, // Use matchedCategoryId
      user: userId,
      date: new Date(),
      billDetails,
    });
  
    return expense.save();
  }
}

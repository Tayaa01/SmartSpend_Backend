// src/expense/expense.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './schemas/expense.schema'; // Expense schema
import { CreateExpenseDto } from './dto/create-expense.dto'; // DTO for creating an expense
import { UpdateExpenseDto } from './dto/update-expense.dto'; // DTO for updating an expense

@Injectable()
export class ExpenseService {
  constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) {}

  async findAllByUser(userId: string): Promise<Expense[]> {
    return this.expenseModel
      .find({ user: userId }) // Query expenses for the user
      .sort({ date: -1 }) // Sort by date in descending order (recent first)
      .exec(); // Execute the query
  }
  
  

  async findOne(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseModel.findOne({ _id: id, user: userId }).exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const createdExpense = new this.expenseModel(createExpenseDto);
    return createdExpense.save(); // Save the new expense
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string): Promise<Expense> {
    const expense = await this.expenseModel.findOne({ _id: id, user: userId }).exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    Object.assign(expense, updateExpenseDto); // Update expense details
    return expense.save(); // Save the updated expense
  }

  async remove(id: string, userId: string): Promise<void> {
    const expense = await this.expenseModel.findOne({ _id: id, user: userId }).exec();
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    await this.expenseModel.deleteOne({ _id: id, user: userId }).exec(); // Use deleteOne instead of remove
  }
  async getTotalExpensesByUser(userId: string): Promise<number> {
    const expenses = await this.expenseModel.find({ user: userId }).exec(); // Fetch all expenses for the user
    return expenses.reduce((total, expense) => total + expense.amount, 0); // Sum up the amounts
  }

  // src/expense/expense.service.ts
async getTotalExpensesByUserAndPeriod(userId: string, period: string): Promise<number> {
  const expenses = await this.expenseModel
    .find({ user: userId, date: { $gte: new Date(`${period}-01`), $lt: new Date(`${period}-31`) } })
    .exec();
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

  
  
  
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Income } from './schemas/income.schema'; // Income schema
import { CreateIncomeDto } from './dto/create-income.dto'; // DTO for creating an income
import { UpdateIncomeDto } from './dto/update-income.dto'; // DTO for updating an income

@Injectable()
export class IncomeService {
  constructor(@InjectModel(Income.name) private incomeModel: Model<Income>) {}

  // Get all incomes for the user
  async findAllByUser(userId: string): Promise<Income[]> {
    return this.incomeModel
      .find({ user: userId }) // Query expenses for the user
      .sort({ date: -1 }) // Sort by date in descending order (recent first)
      .exec(); // Execute the query
  }

  // Get a single income by ID
  async findOne(id: string, userId: string): Promise<Income> {
    const income = await this.incomeModel.findOne({ _id: id, user: userId }).exec();
    if (!income) {
      throw new NotFoundException('Income not found');
    }
    return income;
  }

  // Create a new income
  async create(createIncomeDto: CreateIncomeDto): Promise<Income> {
    const createdIncome = new this.incomeModel(createIncomeDto);
    return createdIncome.save();
  }

  // Update an income by ID
  async update(id: string, updateIncomeDto: UpdateIncomeDto, userId: string): Promise<Income> {
    const income = await this.incomeModel.findOne({ _id: id, user: userId }).exec();
    if (!income) {
      throw new NotFoundException('Income not found');
    }
    Object.assign(income, updateIncomeDto);
    return income.save();
  }

  // Delete an income by ID
  async remove(id: string, userId: string): Promise<void> {
    const income = await this.incomeModel.findOne({ _id: id, user: userId }).exec();
    if (!income) {
      throw new NotFoundException('Income not found');
    }
    await this.incomeModel.deleteOne({ _id: id, user: userId }).exec();
  }

  // Get total income for the user
  async getTotalIncomeByUser(userId: string): Promise<number> {
    const incomes = await this.incomeModel.find({ user: userId }).exec();
    return incomes.reduce((total, income) => total + income.amount, 0);
  }
  // src/income/income.service.ts
async getTotalIncomeByUserAndPeriod(userId: string, period: string): Promise<number> {
  const incomes = await this.incomeModel
    .find({ user: userId, date: { $gte: new Date(`${period}-01`), $lt: new Date(`${period}-31`) } })
    .exec();
  return incomes.reduce((total, income) => total + income.amount, 0);
}

}

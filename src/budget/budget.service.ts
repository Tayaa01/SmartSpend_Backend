import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './schemas/budget.schema';

@Injectable()
export class BudgetService {
  constructor(@InjectModel(Budget.name) private readonly budgetModel: Model<Budget>) {}

  // Créer un nouveau budget
  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const createdBudget = new this.budgetModel(createBudgetDto);
    return createdBudget.save();
  }

  // Récupérer tous les budgets
  async findAll(): Promise<Budget[]> {
    return this.budgetModel.find().populate('user').exec();
  }

  // Récupérer un budget par ID
  async findOne(id: string): Promise<Budget> {
    const budget = await this.budgetModel.findById(id).populate('user').exec();
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return budget;
  }

  // Mettre à jour un budget existant
  async update(id: string, updateBudgetDto: UpdateBudgetDto): Promise<Budget> {
    const updatedBudget = await this.budgetModel
      .findByIdAndUpdate(id, updateBudgetDto, { new: true })
      .exec();
    if (!updatedBudget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return updatedBudget;
  }

  // Supprimer un budget
  async remove(id: string): Promise<void> {
    const result = await this.budgetModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {}

  /**
   * Crée une nouvelle catégorie.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  /**
   * Récupère toutes les catégories.
   */
  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }
  async findByName(name: string): Promise<Category | null> {
    return this.categoryModel.findOne({ name }).exec();
  }

  /**
   * Récupère une catégorie par son ID.
   */
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  /**
   * Met à jour une catégorie par son ID.
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  /**
   * Supprime une catégorie par son ID.
   */
  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
  async getAllExpenseCategories(): Promise<Category[]> {
    // Fetch all categories where type is 'Expense' and return only the name field
    const expenseCategories = await this.categoryModel
      .find({ type: 'Expense' })
      .exec();
  
    // Return an array of names
     return expenseCategories;
  }

  async getAllIncomeCategories(): Promise<Category[]> {
    // Fetch all categories where type is 'Income' and return only the name field
    const expenseCategories = await this.categoryModel
      .find({ type: 'Income' })
      .exec();
  
    // Return an array of names
    return expenseCategories;
  }
}

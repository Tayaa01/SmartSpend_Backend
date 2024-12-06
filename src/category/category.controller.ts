import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpStatus, 
  HttpCode 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Crée une nouvelle catégorie.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    schema: {
      example: {
        id: '1',
        name: 'Groceries',
        type: 'Expense',
      },
    },
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  /**
   * Récupère toutes les catégories.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({
    status: 200,
    description: 'A list of all categories.',
    schema: {
      example: [
        { id: '1', name: 'Groceries', type: 'Expense' },
        { id: '2', name: 'Salary', type: 'Income' },
      ],
    },
  })
  async findAll() {
    return this.categoryService.findAll();
  }
  /**
   * Récupère toutes les catégories de type 'expense'.
   */
  @Get('expense')
@ApiOperation({ summary: 'Retrieve all expense category names' })
@ApiResponse({
  status: 200,
  description: 'A list of all expense category names.',
  schema: {
    example: ['Groceries', 'Rent', 'Utilities'],
  },
})
async getExpenseCategories() {
  return this.categoryService.getAllExpenseCategories();
}

@Get('income')
@ApiOperation({ summary: 'Retrieve all income category names' })
@ApiResponse({
  status: 200,
  description: 'A list of all income category names.',
  schema: {
    example: ['Salary', 'Other'],
  },
})
async getIncomeCategories() {
  return this.categoryService.getAllIncomeCategories();
}

  /**
   * Récupère une catégorie par son ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the category to retrieve',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The category with the specified ID.',
    schema: {
      example: { id: '1', name: 'Groceries', type: 'Expense' },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  /**
   * Met à jour une catégorie par son ID.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the category to update',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated category.',
    schema: {
      example: { id: '1', name: 'Groceries', type: 'Expense' },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  /**
   * Supprime une catégorie par son ID.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the category to delete',
    example: '1',
  })
  @ApiResponse({
    status: 204,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
  }

  
}

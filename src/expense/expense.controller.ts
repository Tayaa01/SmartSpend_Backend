import { Controller, Post, Body, UseGuards, Get, Param, Delete, Put } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './schemas/expense.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // JWT Guard to protect routes
import { CurrentUser } from 'src/auth/current-user.decorator'; // Import the new decorator
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Expense')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // Create a new expense
  @Post()
  @UseGuards(JwtAuthGuard) // Protect route with JWT guard
  @ApiBody({
    description: 'Create a new expense',
    type: CreateExpenseDto,
    examples: {
      'application/json': {
        value: {
          amount: 100,
          description: 'Lunch at a restaurant',
          date: '2024-11-27T12:00:00Z',
          category: '6476be5d8f6e1b3b4a78bb0c', // Example category ID (ObjectId)
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Expense created successfully.' })
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: any, // Extract current user from JWT
  ): Promise<Expense> {
    createExpenseDto.user = user.userId; // Assign user ID to expense
    return this.expenseService.create(createExpenseDto);
  }

  // Get all expenses for the authenticated user
  @Get()
  @UseGuards(JwtAuthGuard) // Protect route with JWT guard
  @ApiResponse({ status: 200, description: 'Fetch all expenses for the user.' })
  async findAll(@CurrentUser() user: any): Promise<Expense[]> {
    return this.expenseService.findAllByUser(user.userId); // Filter expenses by user ID
  }

  // Get a single expense by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard) // Protect route with JWT guard
  @ApiResponse({ status: 200, description: 'Fetch an expense by its ID.' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any): Promise<Expense> {
    return this.expenseService.findOne(id, user.userId); // Get expense by ID and user ID
  }

  // Update an existing expense
  @Put(':id')
  @UseGuards(JwtAuthGuard) // Protect route with JWT guard
  @ApiBody({
    description: 'Update an existing expense',
    type: UpdateExpenseDto,
    examples: {
      'application/json': {
        value: {
          amount: 120,
          description: 'Dinner at a restaurant',
          date: '2024-11-28T18:00:00Z',
          category: '6476be5d8f6e1b3b4a78bb0c', // Example category ID (ObjectId)
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Expense updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() user: any, // Extract user from request
  ): Promise<Expense> {
    updateExpenseDto.user = user.userId; // Attach user ID to the update
    return this.expenseService.update(id, updateExpenseDto, user.userId);
  }

  // Delete an expense by ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Protect route with JWT guard
  @ApiResponse({ status: 200, description: 'Expense removed successfully.' })
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<void> {
    return this.expenseService.remove(id, user.userId); // Remove the expense for the user
  }
}

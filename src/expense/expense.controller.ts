import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './schemas/expense.schema';

@ApiTags('expense')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully.', type: Expense })
  @ApiBody({
    description: 'Payload for creating a new expense',
    schema: {
      example: {
        amount: 100,
        description: 'Grocery shopping',
        date: '2024-11-26',
        category: '64e1f89ebf7e9c0ffcb98abc',
        user: '64e2a67ebf7e9c0ffcb98def', // Example ObjectId of a Category
      },
    },
  })
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all expenses' })
  @ApiResponse({ status: 200, description: 'List of all expenses.', type: [Expense] })
  findAll() {
    return this.expenseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific expense by ID' })
  @ApiResponse({ status: 200, description: 'The requested expense.', type: Expense })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully.', type: Expense })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  @ApiBody({
    description: 'Payload for updating an expense',
    schema: {
      example: {
        amount: 120,
        description: 'Updated grocery shopping',
        date: '2024-11-26',
        category: '64e1f89ebf7e9c0ffcb98abc',
        user: '64e2a67ebf7e9c0ffcb98def', // Example ObjectId of a Category
      },
    },
  })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
}

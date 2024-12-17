import { Controller, Post, Body, Get, Param, Delete, Put, Query, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './schemas/expense.schema';
import { ApiBody, ApiResponse, ApiTags ,ApiConsumes} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service'; // Inject AuthService
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Expense')
@Controller('expense')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly authService: AuthService, // Inject AuthService to get current user from token
  ) {}

  // Create a new expense
  @Post()
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
    @Query('token') token: string, // Accept token as query parameter
  ): Promise<Expense> {
    const user = await this.authService.getCurrentUser(token); // Get current user from token
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    createExpenseDto.user = user.id; // Assign user ID to expense
    return this.expenseService.create(createExpenseDto);
  }

  @Post('scan-bill')
@UseInterceptors(FileInterceptor('file')) // 'file' is the name of the field
@ApiConsumes('multipart/form-data') // Specify content type
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary', // Swagger UI will show an upload button for this
      },
      
    },
  },
})
async scanBill(
  @UploadedFile() file: Express.Multer.File,
  @Query('token') token: string, // Token passed as a query parameter
) {
  if (!file) {
    throw new Error('File is required!');
  }

  // Get the current user from the token
  const user = await this.authService.getCurrentUser(token);
  if (!user) {
    throw new UnauthorizedException('Invalid or expired token');
  }

  // Pass the file and user ID to the service
  return this.expenseService.scanBill(file, user.id);
}


  // Get all expenses for the authenticated user
  @Get()
  @ApiResponse({ status: 200, description: 'Fetch all expenses for the user.' })
  async findAll(@Query('token') token: string): Promise<Expense[]> {
    const user = await this.authService.getCurrentUser(token); // Get current user from token
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.expenseService.findAllByUser(user.id); // Filter expenses by user ID
  }

  // Add this method to get expenses by email
  @Get('by-email')
  @ApiResponse({ status: 200, description: 'Fetch all expenses for the user by email.' })
  async findAllByEmail(@Query('email') email: string): Promise<Expense[]> {
    const user = await this.authService.getUserByEmail(email); // Get user by email
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.expenseService.findAllByUser(user.id); // Filter expenses by user ID
  }

  // Get a single expense by ID
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Fetch an expense by its ID.' })
  async findOne(@Param('id') id: string, @Query('token') token: string): Promise<Expense> {
    const user = await this.authService.getCurrentUser(token); // Get current user from token
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.expenseService.findOne(id, user.id); // Get expense by ID and user ID
  }

  // Update an existing expense
  @Put(':id')
  @ApiBody({
    description: 'Update an existing expense',
    type: CreateExpenseDto,
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
    @Body() updateExpenseDto: CreateExpenseDto,
    @Query('token') token: string, // Accept token as query parameter
  ): Promise<Expense> {
    const user = await this.authService.getCurrentUser(token); // Get current user from token
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    updateExpenseDto.user = user.id; // Attach user ID to the update
    return this.expenseService.update(id, updateExpenseDto, user.id);
  }

  // Delete an expense by ID
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Expense removed successfully.' })
  async remove(@Param('id') id: string, @Query('token') token: string): Promise<void> {
    const user = await this.authService.getCurrentUser(token); // Get current user from token
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.expenseService.remove(id, user.id); // Remove the expense for the user
  }
}

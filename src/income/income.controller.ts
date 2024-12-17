import { Controller, Post, Body, Get, Param, Delete, Put, Query, UnauthorizedException } from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './schemas/income.schema';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service'; // Inject AuthService

@ApiTags('Income')
@Controller('income')
export class IncomeController {
  constructor(
    private readonly incomeService: IncomeService,
    private readonly authService: AuthService, // Inject AuthService to get current user from token
  ) {}

  // Create a new income
  @Post()
  @ApiBody({
    description: 'Create a new income',
    type: CreateIncomeDto,
    examples: {
      'application/json': {
        value: {
          amount: 1000,
          description: 'Salary for the month',
          date: '2024-11-27T12:00:00Z',
          category: '6476be5d8f6e1b3b4a78bb0c', // Example category ID (ObjectId)
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Income created successfully.' })
  async create(
    @Body() createIncomeDto: CreateIncomeDto,
    @Query('token') token: string, // Accept token as query parameter
  ): Promise<Income> {
    const user = await this.authService.getCurrentUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    createIncomeDto.user = user.id;
    return this.incomeService.create(createIncomeDto);
  }

  // Get all incomes for the authenticated user
  @Get()
  @ApiResponse({ status: 200, description: 'Fetch all incomes for the user.' })
  async findAll(@Query('token') token: string): Promise<Income[]> {
    const user = await this.authService.getCurrentUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.incomeService.findAllByUser(user.id);
  }

  // Get total income for the user
  @Get('total')
  @ApiResponse({ status: 200, description: 'Fetch total income for the user.' })
  async getTotalIncome(@Query('token') token: string): Promise<{ total: number }> {
    const user = await this.authService.getCurrentUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const total = await this.incomeService.getTotalIncomeByUser(user.id);
    return { total };
  }
  // Add this method to get incomes by email without token validation
  @Get('by-email')
  @ApiResponse({ status: 200, description: 'Fetch all incomes for the user by email.' })
  async findAllByEmail(@Query('email') email: string): Promise<Income[]> {
    const user = await this.authService.getUserByEmail(email); // Get user by email
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.incomeService.findAllByUser(user.id); // Filter incomes by user ID
  }

  // Get a single income by ID
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Fetch an income by its ID.' })
  async findOne(@Param('id') id: string, @Query('token') token: string): Promise<Income> {
    const user = await this.authService.getCurrentUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.incomeService.findOne(id, user.id);
  }

  

  // Update an existing income
  @Put(':id')
  @ApiBody({
    description: 'Update an existing income',
    type: UpdateIncomeDto,
    examples: {
      'application/json': {
        value: {
          amount: 1200,
          description: 'Freelance work',
          date: '2024-11-28T18:00:00Z',
          category: '6476be5d8f6e1b3b4a78bb0c', // Example category ID (ObjectId)
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Income updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @Query('token') token: string,
  ): Promise<Income> {
    const user = await this.authService.getCurrentUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    updateIncomeDto.user = user.id;
    return this.incomeService.update(id, updateIncomeDto, user.id);
  }

  // Delete an income by ID
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Income removed successfully.' })
  async remove(@Param('id') id: string, @Query('token') token: string): Promise<void> {
    const user = await this.authService.getCurrentUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.incomeService.remove(id, user.id);
  }
}

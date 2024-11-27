// src/expense/dto/create-expense.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsDateString, IsMongoId } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string; // Injected from authenticated user
}

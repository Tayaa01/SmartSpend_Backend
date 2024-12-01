// src/income/dto/create-income.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsDateString, IsMongoId } from 'class-validator';

export class CreateIncomeDto {
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
  category: string;  // Reference to Category (if applicable)

  @IsNotEmpty()
  @IsMongoId()
  user: string;  // Injected from authenticated user
}

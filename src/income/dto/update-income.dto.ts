// src/income/dto/update-income.dto.ts
import { IsOptional, IsNumber, IsString, IsDateString, IsMongoId } from 'class-validator';

export class UpdateIncomeDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsMongoId()
  category?: string; // Optional category reference

  @IsOptional()
  @IsMongoId()
  user?: string;  // Optional user reference
}

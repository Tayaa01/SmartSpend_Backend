import { IsNotEmpty, IsNumber, IsString, IsMongoId, Min } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsNumber()
  Budget: number;

  @IsNotEmpty()
  @IsString()
  period: string;

  @IsNotEmpty()
  @IsNumber()
  savings: number;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}

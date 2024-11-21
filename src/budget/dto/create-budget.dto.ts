import { IsNotEmpty, IsNumber, IsString, IsMongoId, Min } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNotEmpty()
  @IsString()
  period: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  savings: number;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}

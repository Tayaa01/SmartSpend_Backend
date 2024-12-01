// src/income/income.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';
import { Income, IncomeSchema } from './schemas/income.schema';
import { AuthModule } from '../auth/auth.module';  // Import AuthModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Income.name, schema: IncomeSchema }]),
    AuthModule, // Add AuthModule here
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
  exports: [IncomeService],
})
export class IncomeModule {}

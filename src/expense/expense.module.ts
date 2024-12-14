import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module'; // Import CategoryModule
import { HttpModule } from '@nestjs/axios'; // Import HttpModule
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    AuthModule,
    CategoryModule, // Import CategoryModule here to resolve CategoryService
    HttpModule, // Import HttpModule to resolve HttpService
    ConfigModule, // Import ConfigModule to resolve ConfigService
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}

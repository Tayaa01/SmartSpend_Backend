// src/expense/expense.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule directly

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    JwtModule.register({
      secret: 'mySuperSecretKey123', // Use the same secret key as in AuthModule
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}

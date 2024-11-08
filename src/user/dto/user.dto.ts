// src/user/dto/user.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)  // Minimum length of 6 characters for security
  password: string;

  @ApiProperty({ description: 'User preferences', required: false, isArray: true })
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Name of the user', required: false })
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Email of the user', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'User preferences', required: false, isArray: true })
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];
}

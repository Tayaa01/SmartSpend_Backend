// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';  // Import LoginDto
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')  // Swagger tag to group this controller under "Auth"
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })  // Swagger operation description
  @ApiBody({ type: LoginDto })  // Swagger body to document request structure
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;  // Use the DTO to access email and password
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}

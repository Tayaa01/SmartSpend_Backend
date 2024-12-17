import { Controller, Post, Body, Query, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email.toLowerCase(), password); // Convert email to lowercase
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({
    schema: {
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
        },
      },
    },
  })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    schema: {
      properties: {
        newPassword: {
          type: 'string',
          example: 'newSecurePassword123',
        },
      },
    },
  })
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @Get('current-user')
  @ApiOperation({ summary: 'Get current user by token' })
  @ApiQuery({
    name: 'token',
    type: 'string',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwic3ViIjoiNjEyNDM4ODk2YWZkYjQ2NmI4ZjYxZDFlIiwiaWF0IjoxNjk3MTI3ODUyLCJleHAiOjE2OTcxMzE0NTJ9.tNVfUVG_yIb9mR3P1R9Ap-nZZ_w49lbN8M50bWa9HEg',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user details',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  async getCurrentUser(@Query('token') token: string) {
    return this.authService.getCurrentUser(token);
  }
}

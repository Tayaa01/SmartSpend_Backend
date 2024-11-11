// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate the user credentials (email and password)
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  // Generate JWT token for valid user
  async login(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.name, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Validate the user by JWT token payload (for protected routes)
  async validateUserByJwt(payload: any): Promise<User> {
    return this.userService.findOne(payload.sub);
  }
}

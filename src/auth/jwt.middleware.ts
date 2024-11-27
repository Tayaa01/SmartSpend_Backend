// src/auth/jwt.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/user/schemas/user.schema';  // Import the User schema
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>, // Inject User model
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from the header

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = this.jwtService.verify(token); // Verify the JWT token
      // Fetch the user from the database using the payload's sub (userId)
      this.userModel.findById(payload.sub).exec().then((user) => {
        if (!user) {
          throw new UnauthorizedException('Invalid token');
        }
        
        // Attach the user to the request directly
        req['user'] = user; // Assign the user object directly to req.user
        next();  // Continue to the next middleware or route handler
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

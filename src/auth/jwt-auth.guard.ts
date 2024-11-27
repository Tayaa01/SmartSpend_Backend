import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  // Override canActivate to handle token extraction and validation
  async canActivate(context: any): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      // Verify the token and attach the decoded payload to the request object
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload; // Attach the decoded user to the request
      return true; // Token is valid, allow access
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Method to extract the token from the request (Authorization header)
  private extractTokenFromRequest(request: Request): string | null {
    const bearerToken = request.headers['authorization'];
    if (!bearerToken) {
      return null;
    }
    const [, token] = bearerToken.split(' '); // Split to get the token after 'Bearer '
    return token || null;
  }
}

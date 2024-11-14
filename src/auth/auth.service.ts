import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import * as nodemailer from 'nodemailer';  // Import nodemailer

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

  // 1. Forgot Password: Generate a password reset token and send it via email
  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate JWT reset token (valid for 1 hour)
    const payload = { email: user.email };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Send the reset token to the user's email address using Nodemailer
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail's SMTP service
      auth: {
        user: 'tayaaayachi07@gmail.com', // Your Gmail address
        pass: 'wdnz zlci zcbg gpvj',  // Your Gmail password or App Password if 2FA is enabled
      },
    });

    // Send the reset email
    await transporter.sendMail({
      from: '"SmartSpend App" <tayaaayachi07@gmail.com>', // Sender address
      to: email, // Receiver email
      subject: 'Password Reset Request',
      text: `To reset your password, please click the following link: ${resetLink}`,
    });

    return { message: 'Password reset link sent successfully' };
  }

  // 2. Reset Password: Validate the token and update the user's password
  async resetPassword(token: string, newPassword: string) {
    try {
      // Decode and verify the reset token
      const decoded: { email: string } = this.jwtService.verify(token); // Cast to correct type
      console.log('Decoded email:', decoded.email); // Log the decoded email
  
      const user = await this.userService.findByEmail(decoded.email);
      if (!user) {
        console.log('User not found:', decoded.email); // Log if user is not found
        throw new UnauthorizedException('Invalid or expired token');
      }
  
      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      await this.userService.updatePassword(user.id, hashedPassword);
  
      return { message: 'Password successfully reset' };
    } catch (error) {
      console.error('Error in resetPassword:', error); // Log any errors
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

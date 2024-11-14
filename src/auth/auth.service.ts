import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import * as nodemailer from 'nodemailer';  // Import nodemailer

@Injectable()
export class AuthService {
  private resetTokens = new Map<string, { token: string, expiry: number }>();  // Map to store tokens and expiry

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

  // Generate a 6-digit token for password reset
  private generateResetToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();  // Generates a 6-digit random number
  }

  // Forgot Password: Generate a password reset token and send it via email
  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate the 6-digit reset token
    const resetToken = this.generateResetToken();

    // Store the token with an expiry of 15 minutes
    this.resetTokens.set(email, { token: resetToken, expiry: Date.now() + 15 * 60 * 1000 });

    // Create an HTML email template with inline CSS
    const emailHtml = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
              color: #333;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #333;
              font-size: 24px;
            }
            .message {
              margin: 20px 0;
              font-size: 16px;
            }
            .button {
              display: inline-block;
              background-color: #007bff;
              color: #fff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              text-align: center;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="message">
              <p>Hello ${user.name},</p>
              <p>We received a request to reset your password. Please use the following token to reset your password:</p>
              <h2 style="text-align: center; font-size: 32px; color: #333;">${resetToken}</h2>
              <p style="text-align: center;">This token is valid for 15 minutes. Please reset your password as soon as possible.</p>
              <p>If you didn't request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Best regards,</p>
              <p>SmartSpend Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create Nodemailer transporter with Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tayaaayachi07@gmail.com',
        pass: 'wdnz zlci zcbg gpvj',  // Your Gmail password or App Password if 2FA is enabled
      },
    });

    // Send the reset email with the HTML content
    await transporter.sendMail({
      from: '"SmartSpend App" <tayaaayachi07@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      html: emailHtml,  // Use the HTML content here
    });

    return { message: 'Password reset token sent successfully' };
  }

  // Reset Password: Validate the token and update the user's password
  async resetPassword(token: string, newPassword: string) {
    // Search for a matching token in the resetTokens map
    const resetData = Array.from(this.resetTokens.values()).find((data) => data.token === token);
    if (!resetData || resetData.expiry < Date.now()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Get the user's email based on the token (you may have saved the email with the token in your map)
    const email = Array.from(this.resetTokens.keys()).find((key) => this.resetTokens.get(key)?.token === token);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await this.userService.updatePassword(user.id, hashedPassword);

    // Remove the token from the resetTokens map
    this.resetTokens.delete(email);

    return { message: 'Password successfully reset' };
  }
}

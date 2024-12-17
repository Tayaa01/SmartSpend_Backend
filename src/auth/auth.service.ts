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
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 40px auto;
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #8e7cc3;
          color: #fff;
          text-align: center;
          padding: 20px;
        }
        .header h1 {
          font-size: 24px;
          margin: 0;
        }
        .body {
          padding: 20px;
        }
        .body p {
          line-height: 1.6;
          margin: 10px 0;
        }
        .token {
          text-align: center;
          margin: 30px 0;
          font-size: 32px;
          font-weight: bold;
          color: #8e7cc3;
          border: 2px dashed #8e7cc3;
          padding: 10px;
          border-radius: 8px;
          background-color: #f9f8fc;
        }
        .footer {
          background-color: #f4f4f4;
          color: #888;
          text-align: center;
          padding: 15px;
          font-size: 12px;
        }
        .footer a {
          color: #8e7cc3;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="body">
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password. Please use the token below to proceed:</p>
          <div class="token">${resetToken}</div>
          <p>This token is valid for 15 minutes. If you didn’t request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p><strong>SmartSpend Team</strong></p>
          <p><a href="#">Visit Our Website</a></p>
        </div>
      </div>
    </body>
  </html>
`;



    // Create Nodemailer transporter with Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Your Gmail email address
        pass: process.env.EMAIL_PASSWORD,  // Your Gmail password or App Password if 2FA is enabled
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

  // Add this method to get user by email
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async getCurrentUser(token: string): Promise<User> {
    try {
      const decodedToken = this.jwtService.verify(token);
      return await this.userService.findOne(decodedToken.sub);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

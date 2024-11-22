"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_service_1 = require("../user/user.service");
const nodemailer = require("nodemailer");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.resetTokens = new Map();
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.name, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async validateUserByJwt(payload) {
        return this.userService.findOne(payload.sub);
    }
    generateResetToken() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const resetToken = this.generateResetToken();
        this.resetTokens.set(email, { token: resetToken, expiry: Date.now() + 15 * 60 * 1000 });
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
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tayaaayachi07@gmail.com',
                pass: 'wdnz zlci zcbg gpvj',
            },
        });
        await transporter.sendMail({
            from: '"SmartSpend App" <tayaaayachi07@gmail.com>',
            to: email,
            subject: 'Password Reset Request',
            html: emailHtml,
        });
        return { message: 'Password reset token sent successfully' };
    }
    async resetPassword(token, newPassword) {
        const resetData = Array.from(this.resetTokens.values()).find((data) => data.token === token);
        if (!resetData || resetData.expiry < Date.now()) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        const email = Array.from(this.resetTokens.keys()).find((key) => this.resetTokens.get(key)?.token === token);
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userService.updatePassword(user.id, hashedPassword);
        this.resetTokens.delete(email);
        return { message: 'Password successfully reset' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
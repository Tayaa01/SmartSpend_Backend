import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private resetTokens;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
    }>;
    validateUserByJwt(payload: any): Promise<User>;
    private generateResetToken;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}

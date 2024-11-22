export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    preferences?: string[];
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    preferences?: string[];
}

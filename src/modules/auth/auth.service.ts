import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmail(
            email
        );

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // compare password with hashed password in database
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // return user temporarily, in real application you would return a JWT token or session
        return {
            message: "Login successful",
            user,
        };
    }
}
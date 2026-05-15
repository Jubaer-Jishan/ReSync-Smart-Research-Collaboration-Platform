import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmail(
            email
        );

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (!user.isEmailVerified) {
            throw new UnauthorizedException("Email is not verified");
        }

        // compare password with hashed password in database
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            message: 'Login successful',
            accessToken,
            user: this.sanitizeUser(user),
        };
    }

    async register(registerDto: RegisterDto) {
        const user = await this.usersService.createUser(registerDto);

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            message: 'Registration successful',
            accessToken,
            user: this.sanitizeUser(user),
        };
    }

    async logout() {
        return { success: true };
    }

    private sanitizeUser(user: User) {
        const { password, refreshToken, ...safeUser } = user;
        return safeUser;
    }
}
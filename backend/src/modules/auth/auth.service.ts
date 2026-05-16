import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import type { Request } from 'express';
import type { RedisClientType } from 'redis';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
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

    async logout(req: Request) {
        const token = this.getTokenFromRequest(req);

        if (!token) {
            throw new UnauthorizedException('Invalid token');
        }

        const decoded = this.jwtService.decode(token) as { exp?: number } | null;

        if (!decoded?.exp) {
            throw new UnauthorizedException('Invalid token');
        }

        const nowSeconds = Math.floor(Date.now() / 1000);
        const ttlSeconds = Math.max(decoded.exp - nowSeconds, 0);
        const key = this.getBlacklistKey(token);

        await this.redisClient.set(key, '1', { EX: Math.max(ttlSeconds, 1) });

        return { success: true };
    }

    private sanitizeUser(user: User) {
        const { password, refreshToken, ...safeUser } = user;
        return safeUser;
    }

    private getTokenFromRequest(req: Request): string | null {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return null;
        }

        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
            return null;
        }

        return token;
    }

    private getBlacklistKey(token: string): string {
        const hash = createHash('sha256').update(token).digest('hex');
        return `bl:at:${hash}`;
    }
}
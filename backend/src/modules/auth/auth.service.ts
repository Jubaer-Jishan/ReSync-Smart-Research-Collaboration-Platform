import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import type { Request } from 'express';
import type { RedisClientType } from 'redis';
import type { StringValue } from 'ms';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

type AuthTokenPair = {
    accessToken: string;
    refreshToken: string;
};

type AuthResult = AuthTokenPair & {
    rememberMe: boolean;
    message: string;
    user: Omit<User, 'password' | 'refreshToken' | 'refreshTokenRememberMe'>;
};

type JwtUserPayload = {
    id: string;
    email: string;
    role: string;
};

type RefreshJwtPayload = {
    sub: string;
    email: string;
    role: string;
    tokenType: 'refresh';
};

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    ) {}

    async login(loginDto: LoginDto): Promise<AuthResult> {
        const { email, password, rememberMe = false } = loginDto;

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

        const tokens = await this.issueTokenPair(user, rememberMe);
        await this.usersService.setRefreshToken(user.id, tokens.refreshToken, rememberMe);

        return {
            message: 'Login successful',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            rememberMe,
            user: this.sanitizeUser(user),
        };
    }

    async register(registerDto: RegisterDto): Promise<AuthResult> {
        const user = await this.usersService.createUser(registerDto);
        const rememberMe = registerDto.rememberMe ?? false;

        const tokens = await this.issueTokenPair(user, rememberMe);
        await this.usersService.setRefreshToken(user.id, tokens.refreshToken, rememberMe);

        return {
            message: 'Registration successful',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            rememberMe,
            user: this.sanitizeUser(user),
        };
    }

    async refresh(refreshToken: string): Promise<AuthResult> {
        const payload = await this.verifyRefreshToken(refreshToken);
        const user = await this.usersService.validateRefreshToken(payload.sub, refreshToken);

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid token');
        }

        const rememberMe = user.refreshTokenRememberMe ?? false;
        const tokens = await this.issueTokenPair(user, rememberMe);
        await this.usersService.setRefreshToken(user.id, tokens.refreshToken, rememberMe);

        return {
            message: 'Token refreshed successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            rememberMe,
            user: this.sanitizeUser(user),
        };
    }

    async logout(req: Request) {
        const token = this.getTokenFromRequest(req);
        const authUser = (req as Request & { user?: JwtUserPayload }).user;

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
        if (authUser?.id) {
            await this.usersService.clearRefreshToken(authUser.id);
        }

        return { success: true };
    }

    private async issueTokenPair(user: User, rememberMe: boolean): Promise<AuthTokenPair> {
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        }, {
            expiresIn: '15m',
        });

        const refreshExpiresIn = rememberMe ? '30d' : '1d';

        const refreshToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
                tokenType: 'refresh' as const,
            } satisfies RefreshJwtPayload,
            {
                secret: this.configService.getOrThrow<string>('auth.refreshJwtSecret'),
                expiresIn: refreshExpiresIn as StringValue,
            },
        );

        return { accessToken, refreshToken };
    }

    private async verifyRefreshToken(refreshToken: string): Promise<RefreshJwtPayload> {
        const payload = await this.jwtService.verifyAsync<RefreshJwtPayload>(refreshToken, {
            secret: this.configService.getOrThrow<string>('auth.refreshJwtSecret'),
        });

        if (payload.tokenType !== 'refresh') {
            throw new UnauthorizedException('Invalid token');
        }

        return payload;
    }

    private sanitizeUser(user: User) {
        const { password, refreshToken, refreshTokenRememberMe, ...safeUser } = user;
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
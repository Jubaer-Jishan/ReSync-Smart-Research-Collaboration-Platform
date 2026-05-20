import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { createHash } from 'crypto';
import type { Request } from 'express';
import type { RedisClientType } from 'redis';
import { UsersService } from '../users/users.service';
import { Role } from '../users/enums/role.enum';

type JwtPayload = {
	sub: string;
	email: string;
	role: Role;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
		@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('auth.jwtSecret'),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload) {
		const token = this.getTokenFromRequest(req);
		if (!token) {
			throw new UnauthorizedException('Invalid token');
		}

		const isBlacklisted = await this.redisClient.exists(this.getBlacklistKey(token));
		if (isBlacklisted) {
			throw new UnauthorizedException('Invalid token');
		}

		const user = await this.usersService.findById(payload.sub);

		if (!user || !user.isActive) {
			throw new UnauthorizedException('Invalid token');
		}

		return {
			id: user.id,
			email: user.email,
			role: user.role,
		};
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

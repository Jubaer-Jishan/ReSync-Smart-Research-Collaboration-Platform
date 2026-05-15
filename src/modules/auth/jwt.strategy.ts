import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
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
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('auth.jwtSecret'),
		});
	}

	async validate(payload: JwtPayload) {
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
}

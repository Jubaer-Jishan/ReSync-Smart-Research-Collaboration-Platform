import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import type { Response } from 'express';
import { AuthService } from "./auth.service";
import { EmailOtpService } from "./email-otp.service";
import { ConfirmEmailOtpDto } from "./dto/confirm-email-otp.dto";
import { LoginDto } from "./dto/login.dto";
import { RequestEmailOtpDto } from "./dto/request-email-otp.dto";
import { RegisterDto } from "./dto/register.dto";
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { VerifyPasswordResetDto } from './dto/verify-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

const REFRESH_TOKEN_COOKIE = 'resync_refresh_token';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * ONE_DAY_MS;

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly emailOtpService: EmailOtpService,
	) {}

	@Post("login")
	async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const result = await this.authService.login(loginDto);
		this.setRefreshTokenCookie(res, result.refreshToken, result.rememberMe);

		return this.stripRefreshToken(result);
	}

	@Post("register")
	async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		const result = await this.authService.register(registerDto);
		this.setRefreshTokenCookie(res, result.refreshToken, result.rememberMe);

		return this.stripRefreshToken(result);
	}

	@Post('refresh')
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const refreshToken = this.getRefreshTokenFromCookie(req);
		const result = await this.authService.refresh(refreshToken);
		this.setRefreshTokenCookie(res, result.refreshToken, result.rememberMe);

		return this.stripRefreshToken(result);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('bearer')
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const result = await this.authService.logout(req);
		this.clearRefreshTokenCookie(res);

		return result;
	}

	@Post("verify-email/request")
	async requestEmailOtp(@Body() dto: RequestEmailOtpDto) {
		return this.emailOtpService.sendOtp(dto.email);
	}

	@Post("verify-email/confirm")
	async confirmEmailOtp(@Body() dto: ConfirmEmailOtpDto) {
		return this.emailOtpService.verifyOtp(dto.email, dto.otp);
	}

	@Post('password-reset/request')
	async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
		return this.emailOtpService.sendPasswordResetOtp(dto.email);
	}

	@Post('password-reset/verify')
	async verifyPasswordReset(@Body() dto: VerifyPasswordResetDto) {
		return this.emailOtpService.verifyPasswordResetOtp(dto.email, dto.otp);
	}

	@Post('password-reset/reset')
	async resetPassword(@Body() dto: ResetPasswordDto) {
		return this.emailOtpService.resetPassword(
			dto.email,
			dto.otp,
			dto.newPassword,
			dto.confirmPassword,
		);
	}

	private setRefreshTokenCookie(res: Response, refreshToken: string, rememberMe: boolean): void {
		res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: rememberMe ? THIRTY_DAYS_MS : ONE_DAY_MS,
		});
	}

	private clearRefreshTokenCookie(res: Response): void {
		res.clearCookie(REFRESH_TOKEN_COOKIE, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			path: '/',
		});
	}

	private getRefreshTokenFromCookie(req: Request): string {
		const cookieHeader = req.headers.cookie;
		if (!cookieHeader) {
			throw new UnauthorizedException('Invalid token');
		}

		const cookie = cookieHeader
			.split(';')
			.map((part) => part.trim())
			.find((part) => part.startsWith(`${REFRESH_TOKEN_COOKIE}=`));

		if (!cookie) {
			throw new UnauthorizedException('Invalid token');
		}

		return decodeURIComponent(cookie.slice(REFRESH_TOKEN_COOKIE.length + 1));
	}

	private stripRefreshToken<T extends { refreshToken: string; rememberMe: boolean }>(result: T) {
		const { refreshToken, rememberMe, ...safeResult } = result;
		return safeResult;
	}
}
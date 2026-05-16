import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
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

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly emailOtpService: EmailOtpService,
	) {}

	@Post("login")
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post("register")
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('bearer')
	async logout(@Req() req: Request) {
		return this.authService.logout(req);
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
}
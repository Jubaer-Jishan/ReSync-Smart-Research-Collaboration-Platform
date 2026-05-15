import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { EmailOtpService } from "./email-otp.service";
import { ConfirmEmailOtpDto } from "./dto/confirm-email-otp.dto";
import { LoginDto } from "./dto/login.dto";
import { RequestEmailOtpDto } from "./dto/request-email-otp.dto";
import { RegisterDto } from "./dto/register.dto";

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

	@Post("verify-email/request")
	async requestEmailOtp(@Body() dto: RequestEmailOtpDto) {
		return this.emailOtpService.sendOtp(dto.email);
	}

	@Post("verify-email/confirm")
	async confirmEmailOtp(@Body() dto: ConfirmEmailOtpDto) {
		return this.emailOtpService.verifyOtp(dto.email, dto.otp);
	}
}
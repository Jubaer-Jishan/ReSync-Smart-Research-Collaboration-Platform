import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  otp!: string;

  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;

  @IsNotEmpty()
  @MinLength(8)
  confirmPassword!: string;
}

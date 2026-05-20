import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { createHash, randomInt } from 'crypto';
import { UsersService } from '../users/users.service';
import { Inject } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class EmailOtpService {
  private readonly resend: Resend;
  private readonly otpTtlSeconds = 300;

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {
    this.resend = new Resend(
      this.configService.getOrThrow<string>('email.resendApiKey'),
    );
  }

  async sendOtp(email: string): Promise<{ success: true }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.isEmailVerified) {
      return { success: true };
    }

    const otp = this.generateOtp();
    const key = this.getOtpKey(user.id);
    const hash = this.hashOtp(otp);

    await this.redis.set(key, hash, { EX: this.otpTtlSeconds });

    await this.resend.emails.send({
      from: this.configService.getOrThrow<string>('email.resendFrom'),
      to: email,
      subject: 'Verify your email',
      html: this.buildEmailHtml(otp),
    });

    return { success: true };
  }

  async sendPasswordResetOtp(email: string): Promise<{ success: true }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { success: true };
    }

    const otp = this.generateOtp();
    const key = this.getPasswordResetKey(user.id);
    const hash = this.hashOtp(otp);

    await this.redis.set(key, hash, { EX: this.otpTtlSeconds });

    await this.resend.emails.send({
      from: this.configService.getOrThrow<string>('email.resendFrom'),
      to: email,
      subject: 'Reset your password',
      html: this.buildPasswordResetHtml(otp),
    });

    return { success: true };
  }

  async verifyOtp(email: string, otp: string): Promise<{ success: true }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const key = this.getOtpKey(user.id);
    const stored = await this.redis.get(key);

    if (!stored) {
      throw new BadRequestException('OTP expired or not found');
    }

    if (stored !== this.hashOtp(otp)) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.usersService.markEmailVerified(user.id);
    await this.redis.del(key);

    return { success: true };
  }

  async verifyPasswordResetOtp(
    email: string,
    otp: string,
  ): Promise<{ success: true }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const key = this.getPasswordResetKey(user.id);
    const stored = await this.redis.get(key);

    if (!stored) {
      throw new BadRequestException('OTP expired or not found');
    }

    if (stored !== this.hashOtp(otp)) {
      throw new BadRequestException('Invalid OTP');
    }

    return { success: true };
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ success: true }> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const key = this.getPasswordResetKey(user.id);
    const stored = await this.redis.get(key);

    if (!stored) {
      throw new BadRequestException('OTP expired or not found');
    }

    if (stored !== this.hashOtp(otp)) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.usersService.updatePassword(user.id, newPassword);
    await this.redis.del(key);

    return { success: true };
  }

  private generateOtp(): string {
    return String(randomInt(100000, 999999));
  }

  private getOtpKey(userId: string): string {
    return `email_otp:${userId}`;
  }

  private getPasswordResetKey(userId: string): string {
    return `password_reset_otp:${userId}`;
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }


  private buildEmailHtml(otp: string): string {
    return `
    <div style="
      margin:0;
      padding:40px 20px;
      background:#f4f7fb;
      font-family:Arial,sans-serif;
    ">

      <div style="
        max-width:600px;
        margin:auto;
        background:#ffffff;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,0.08);
      ">

        <div style="
          background:linear-gradient(135deg,#4F46E5,#7C3AED);
          padding:40px;
          text-align:center;
          color:white;
        ">
          <h1 style="margin:0;font-size:28px;">
            Verify Your Email
          </h1>

          <p style="
            margin-top:10px;
            opacity:.9;
            font-size:15px;
          ">
            Welcome to ReSync. Verify your email to continue.
          </p>
        </div>

        <div style="padding:40px;text-align:center;">

          <p style="
            margin-bottom:25px;
            color:#555;
            font-size:16px;
          ">
            Use the verification code below:
          </p>

          <div style="
            display:inline-block;
            background:#f8f9ff;
            border:2px dashed #6366F1;
            padding:18px 35px;
            border-radius:14px;
            margin-bottom:25px;
          ">
            <span style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              color:#4F46E5;
            ">
              ${otp}
            </span>
          </div>

          <p style="
            color:#666;
            font-size:14px;
          ">
            This code expires in <strong>5 minutes</strong>.
          </p>

          <div style="
            margin-top:35px;
            text-align:left;
            background:#f8fafc;
            border-radius:12px;
            padding:20px;
            border:1px solid #e5e7eb;
          ">

            <h3 style="
              margin-top:0;
              margin-bottom:15px;
              color:#111827;
              font-size:15px;
            ">
              Security Information
            </h3>

            <ul style="
              padding-left:18px;
              color:#6b7280;
              font-size:13px;
              line-height:1.8;
              margin:0;
            ">
              <li>Never share your OTP or verification code with anyone.</li>

              <li>
                ReSync staff will never ask for your password or OTP.
              </li>

              <li>
                This verification code is valid for only 5 minutes.
              </li>

              <li>
                If you didn't request this email, ignore it and secure your account.
              </li>

              <li>
                This is an automated message. Please do not reply.
              </li>

              <li>
                ReSync is a smart research collaboration platform connecting researchers and innovators.
              </li>

            </ul>

          </div>

        </div>

        <div style="
          padding:25px;
          text-align:center;
          background:#fafafa;
          border-top:1px solid #eee;
        ">

          <p style="
            margin:0;
            font-size:13px;
            color:#6b7280;
            font-weight:bold;
          ">
            ReSync — Smart Research Collaboration Platform
          </p>

          <p style="
            margin-top:8px;
            font-size:12px;
            color:#9ca3af;
          ">
            Securely connecting researchers, collaborators, and ideas.
          </p>

          <p style="
            margin-top:16px;
            font-size:11px;
            color:#9ca3af;
          ">
            © ${new Date().getFullYear()} ReSync. All rights reserved.
          </p>

        </div>

      </div>

    </div>
    `;
  }


  private buildPasswordResetHtml(otp: string): string {
    return `
    <div style="
      margin:0;
      padding:40px 20px;
      background:#f4f7fb;
      font-family:Arial,sans-serif;
    ">

      <div style="
        max-width:600px;
        margin:auto;
        background:#ffffff;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,0.08);
      ">

        <div style="
          background:linear-gradient(135deg,#DC2626,#EF4444);
          padding:40px;
          text-align:center;
          color:white;
        ">
          <h1 style="margin:0;font-size:28px;">
            Password Reset Request
          </h1>

          <p style="
            margin-top:10px;
            opacity:.9;
            font-size:15px;
          ">
            We received a request to reset your password.
          </p>
        </div>

        <div style="padding:40px;text-align:center;">

          <p style="
            margin-bottom:25px;
            color:#555;
            font-size:16px;
          ">
            Use the OTP below to continue:
          </p>

          <div style="
            display:inline-block;
            background:#fff5f5;
            border:2px dashed #EF4444;
            padding:18px 35px;
            border-radius:14px;
            margin-bottom:25px;
          ">
            <span style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              color:#DC2626;
            ">
              ${otp}
            </span>
          </div>

          <p style="
            color:#666;
            font-size:14px;
          ">
            This code expires in <strong>5 minutes</strong>.
          </p>

          <div style="
            margin-top:35px;
            text-align:left;
            background:#f8fafc;
            border-radius:12px;
            padding:20px;
            border:1px solid #e5e7eb;
          ">

            <h3 style="
              margin-top:0;
              margin-bottom:15px;
              color:#111827;
              font-size:15px;
            ">
              Security Information
            </h3>

            <ul style="
              padding-left:18px;
              color:#6b7280;
              font-size:13px;
              line-height:1.8;
              margin:0;
            ">
              <li>Never share your OTP with anyone.</li>

              <li>
                ReSync staff will never ask for your password or OTP.
              </li>

              <li>
                If you didn't request a password reset, ignore this email.
              </li>

              <li>
                Consider changing your password if you suspect unauthorized activity.
              </li>

              <li>
                This is an automated email. Please do not reply.
              </li>

              <li>
                ReSync is a smart research collaboration platform connecting researchers and innovators.
              </li>

            </ul>

          </div>

        </div>

        <div style="
          padding:25px;
          text-align:center;
          background:#fafafa;
          border-top:1px solid #eee;
        ">

          <p style="
            margin:0;
            font-size:13px;
            color:#6b7280;
            font-weight:bold;
          ">
            ReSync — Smart Research Collaboration Platform
          </p>

          <p style="
            margin-top:8px;
            font-size:12px;
            color:#9ca3af;
          ">
            Securely connecting researchers, collaborators, and ideas.
          </p>

          <p style="
            margin-top:16px;
            font-size:11px;
            color:#9ca3af;
          ">
            © ${new Date().getFullYear()} ReSync. All rights reserved.
          </p>

        </div>

      </div>

    </div>
    `;
  }
}

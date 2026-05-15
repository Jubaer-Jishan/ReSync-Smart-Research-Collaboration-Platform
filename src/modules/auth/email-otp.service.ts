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

  private generateOtp(): string {
    return String(randomInt(100000, 1000000));
  }

  private getOtpKey(userId: string): string {
    return `email_otp:${userId}`;
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  private buildEmailHtml(otp: string): string {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your email</h2>
        <p>Your OTP code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
        <p>This code expires in 5 minutes.</p>
      </div>
    `;
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async generateOTP(): Promise<string> {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
}

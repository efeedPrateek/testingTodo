import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthCustomerService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: {
    name: string;
    id: string;
    mobile: string;
    role: string;
  }) {
    const payload = { _id: user.id, mobile: user.mobile, role: user.role };
    return this.jwtService.signAsync(payload);
  }

  async verify(token: string) {
    let res = '';
    await this.jwtService
      .verifyAsync(token, {
        secret: process.env.PASS_SECRET,
      })
      .then(async (suc) => {
        res = await suc.name;
      })
      .catch(async (err) => {
        res = await err.name;
      });
    return res;
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthAdminService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = {
      _id: user.id,
      mobile: user.mobile,
      role: user.role,
      name: user.name,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKENTIME,
    });
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

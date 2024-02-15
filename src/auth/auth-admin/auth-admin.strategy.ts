import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthAdminStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TESTINGSECRET',
    });
  }

  async validate(payload: any) {
    const findUser = await this.userService.findOne({
      _id: payload._id,
      isActive: true,
    });
    if (!findUser) {
      return null;
    }
    return { ...payload };
  }
}

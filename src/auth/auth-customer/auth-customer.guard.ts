import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AuthCustomerGuard extends AuthGuard('jwt') {
  canActivate(_context: ExecutionContext) {
    return super.canActivate(_context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new HttpException(
          {
            success: 'false',
            message: 'UN_AUTHORIZED',
            data: {},
            errorCode: 303,
          },
          HttpStatus.OK,
        )
      );
    }
    return user;
  }
}

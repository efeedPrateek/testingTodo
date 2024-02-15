import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppCustomerController } from './auth-customer/app-customer.controller';
import { AuthCustomerService } from './auth-customer/auth-customer.service';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { AuthCustomerStrategy } from './auth-customer/auth-customer.strategy';
import { AuthAdminController } from './auth-admin/auth-admin.controller';
import { AuthAdminService } from './auth-admin/auth-admin.service';
import { AuthAdminStrategy } from './auth-admin/auth-admin.strategy';

import { UserService } from '../user/user.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('PASS_SECRET'),
        signOptions: { expiresIn: configService.get('TOKENTIME') },
      }),
    }),
    PassportModule,
    MongooseModule.forFeature([{ name: 'User', schema: User }]),
  ],
  providers: [
    AuthCustomerService,
    AuthCustomerStrategy,
    AuthAdminStrategy,
    AuthAdminService,

    UserService,
  ],
  controllers: [AppCustomerController, AuthAdminController],
})
export class AuthModule {}

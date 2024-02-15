import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { AuthCustomerService } from '../auth/auth-customer/auth-customer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CustomerModule } from '../customer/customer.module';

import { HttpModule } from '@nestjs/axios';
import { RolesGuard } from '../service/guards/roles.guard';
import { AdminModule } from '../admin/admin.module';
import { AuthAdminService } from '../auth/auth-admin/auth-admin.service';
import { Admin, AdminSchema } from 'src/admin/admin.schema';
import { SmsService } from 'src/service/sendSms';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('PASS_SECRET'),
        signOptions: { expiresIn: configService.get('TOKENTIME') },
      }),
    }),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    HttpModule,
    forwardRef(() => CustomerModule),
    forwardRef(() => AdminModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthCustomerService,
    AuthAdminService,
    SmsService,
    RolesGuard,
  ],
  exports: [UserService],
})
export class UserModule {}

import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Admin, AdminSchema } from './admin.schema';
import { SmsService } from 'src/service/sendSms';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => UserModule),
    HttpModule,
  ],
  providers: [AdminService, SmsService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}

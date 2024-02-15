import { forwardRef, Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './customer.schema';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { User, UserSchema } from 'src/user/user.schema';
import { SmsService } from 'src/service/sendSms';

// const common = new CommonService(Customer, Counter, Order, Address, Reference, WalletModule, ZohoService, WalletModule)
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UserModule),
    HttpModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService, SmsService],
  exports: [CustomerService],
})
export class CustomerModule {}

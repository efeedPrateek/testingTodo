import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.schema';

import { UserService } from '../user/user.service';

import { AuthCustomerGuard } from '../auth/auth-customer/auth-customer.guard';
import { Roles } from '../service/decorators/roles.decorator';
import { UserRole } from '../user/role.enum';
import { RolesGuard } from '../service/guards/roles.guard';
import { AuthAdminGuard } from '../auth/auth-admin/auth-admin.guard';
import { SmsService } from 'src/service/sendSms';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly smsService: SmsService,
    private readonly userService: UserService,
  ) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthAdminGuard, RolesGuard)
  @Post('/')
  async create(
    @Body() payload,
  ): Promise<{ success: boolean; data: Customer; message: string }> {
    const customer = await this.customerService.create({
      user: payload,
      otp: '',
    });
    return {
      success: true,
      data: customer,
      message: 'Data Fetched Successfully!',
    };
  }

  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @UseGuards(AuthCustomerGuard, AuthAdminGuard, RolesGuard)
  @Get('/')
  async find(
    @Query() payload?: any,
  ): Promise<{ success: boolean; data: Customer[]; message: string }> {
    const customers = await this.customerService.findOne(payload);
    return {
      success: true,
      data: customers,
      message: 'Data Fetched Successfully!',
    };
  }

  @Post('/sendOtp')
  async sendOtp(@Body() payload: { mobile: string }) {
    const otp = await this.smsService.generateOTP();
    const customer = await this.customerService.findOne({
      mobile: payload.mobile,
    });
    await this.userService.updateByQuery(
      { mobile: customer.mobile, role: UserRole.CUSTOMER },
      { otp },
    );
    //send OTP
    return {
      success: true,
      message: 'SMS sent Successfully!',
      data: {},
    };
  }
}

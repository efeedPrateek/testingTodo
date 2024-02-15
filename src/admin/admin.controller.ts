import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AdminService } from './admin.service';
import { UserRole } from '../user/role.enum';
import { AuthAdminGuard } from '../auth/auth-admin/auth-admin.guard';
import { AddAdminDTO } from './admin.dto';
import { SmsService } from 'src/service/sendSms';
import { Roles } from 'src/service/decorators/roles.decorator';
import { RolesGuard } from 'src/service/guards/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly smsService: SmsService,
    private readonly userService: UserService,
  ) {}

  @Post('/')
  async create(@Body() payload: AddAdminDTO) {
    const customer = await this.adminService.create({ user: payload, otp: '' });
    return {
      success: true,
      data: customer,
      message: 'Data Fetched Successfully!',
    };
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthAdminGuard, RolesGuard)
  @Get('/')
  async find(@Query() payload?: any) {
    const customers = await this.adminService.find(payload);
    return {
      success: true,
      data: customers,
      message: 'Data Fetched Successfully!',
    };
  }

  // @ApiBody({description: "Enter the Admin Mobile Number"})
  @Post('/sendOtp')
  async sendOtp(@Body() payload: AddAdminDTO) {
    const otp = await this.smsService.generateOTP();
    const admin = await this.adminService.findOne({
      mobile: payload.mobile,
      isActive: true,
    });

    if (admin) {
      await this.userService.updateByQuery(
        { mobile: admin.mobile, role: UserRole.ADMIN, isActive: true },
        { otp, role: UserRole.ADMIN },
      );
      //send OTP
      return {
        success: true,
        message: 'SMS sent Successfully!',
        data: {},
      };
    }
  }
}

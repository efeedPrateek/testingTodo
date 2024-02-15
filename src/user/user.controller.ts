import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserDocument } from './user.schema';
import { AuthCustomerService } from '../auth/auth-customer/auth-customer.service';
import { CustomerService } from '../customer/customer.service';
import { AdminService } from '../admin/admin.service';
import { Roles } from '../service/decorators/roles.decorator';
import { UserRole } from './role.enum';
import { RolesGuard } from '../service/guards/roles.guard';
import { AuthAdminService } from '../auth/auth-admin/auth-admin.service';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthAdminGuard } from '../auth/auth-admin/auth-admin.guard';
import { SmsService } from 'src/service/sendSms';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly authCustomerService: AuthCustomerService,
    private readonly authAdminService: AuthAdminService,
    private readonly smsService: SmsService,
    private readonly customerService: CustomerService,
  ) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthAdminGuard, RolesGuard)
  @Post('/')
  async create(@Body() payload): Promise<User> {
    return this.userService.create(payload);
  }

  //   @Post('/sendOtp')
  //   async sendOtp(@Body() payload: { mobile: string }) {
  //     const otp = await this.smsService.generateOTP();
  //     return this.smsService.sendLoginOtp(payload.mobile, otp);
  //   }

  @Post('/authenticate')
  async login(@Res() res, @Body() data: { mobile: string; otp: string }) {
    const user = await this.userService.findOne({
      mobile: data.mobile,
      role: UserRole.CUSTOMER,
    });
    const customer = await this.customerService.findOne({
      mobile: user.mobile,
    });
    if (!user) {
      return res.status(HttpStatus.OK).json({
        success: false,
        data: new BadRequestException('Invalid Credentials'),
        message: 'Given data can not be processed',
      });
    }
    if (data.otp !== user.otp) {
      return res.status(HttpStatus.OK).json({
        success: false,
        data: new BadRequestException('Invalid Credentials').getResponse(),
        message: 'Given data can not be processed',
      });
    }
    const token = await this.authCustomerService.login({
      name: user.name,
      id: user._id,
      mobile: user.mobile,
      role: user.role,
    });

    await this.userService.updateByQuery(
      { mobile: user.mobile, role: UserRole.CUSTOMER },
      { token },
    );
    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          customerId: customer._id,
          mobile: customer.mobile,
          isActive: customer.isActive,
        },
        role: user.role,
        userId: user._id,
        token,
      },
      message: 'Data Fetched Successfully!',
    });
  }

  // @ApiBody({description: "Enter the Admin Mobile Number and OTP"})
  @Post('/admin/authenticate')
  async adminLogin(@Res() res, @Body() data) {
    try {
      const userS = await this.userModel.find({
        mobile: data.mobile,
        role: UserRole.ADMIN,
      });
      if (!userS.length)
        throw new Error('User is not Found, Please Contact Admin!!');
      const admin = await this.adminService.findOne({
        mobile: userS[0].mobile,
      });
      if (admin) {
        if (data.otp !== userS[0].otp) {
          return res.status(HttpStatus.OK).json({
            success: false,
            data: new BadRequestException('Invalid Credentials').getResponse(),
            message: 'Given data can not be processed',
          });
        }
        const token = await this.authAdminService.login({
          id: userS[0]._id,
          mobile: userS[0].mobile,
          role: userS[0].role,
          name: userS[0].name,
        });
        await this.userService.updateByQuery(userS[0]._id, {
          token,
        });
        return res.status(HttpStatus.OK).json({
          success: true,
          data: {
            admin: {
              firstName: admin.firstName,
              lastName: admin.lastName,
              customerId: admin._id,
              mobile: admin.mobile,
              isActive: admin.isActive,
            },
            role: userS[0].role,
            userId: userS[0]._id,
            token,
          },
          message: 'Data Fetched Successfully!',
        });
      }
    } catch (err) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        data: null,
        message: err.message,
      });
    }
  }
}

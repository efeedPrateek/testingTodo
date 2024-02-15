import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { Admin, AdminDocument } from './admin.schema';
import { AddAdminDTO } from './admin.dto';
import { UserRole } from '../user/role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly userService: UserService,
  ) {}

  async create(payload: { user: AddAdminDTO; otp?: string }): Promise<any> {
    try {
      const findAdmin = await this.adminModel.findOne({
        mobile: payload.user.mobile,
      });
      if (findAdmin) {
        throw new Error('Active Admin cannot have duplicate Mobile Number!!');
      }
      //if already present User change isActive to false
      const findUser = await this.userService.findOne({
        mobile: payload.user.mobile,
        role: UserRole.ADMIN,
      });
      if (findUser) {
        throw new Error(
          'Active User cannot have duplicate Mobile Number as Admin!!',
        );
      }
      const admin = await new this.adminModel(payload.user);
      const user = await this.userService.create({
        mobile: payload.user.mobile,
        otp: payload.otp,
        name: payload.user.firstName,
        role: UserRole.ADMIN,
      });
      return admin.save();
    } catch (err) {
      console.log(err);

      return {
        success: 500,
        message: err.message,
      };
    }
  }
  async findOne(filterQuery: FilterQuery<AdminDocument>): Promise<any> {
    return this.adminModel.findOne(filterQuery);
  }

  async find(filter: FilterQuery<AdminDocument>): Promise<Admin[]> {
    return this.adminModel.find(filter);
  }

  async update(id: string, filter: any): Promise<any> {
    return this.adminModel.updateOne({ _id: id }, filter);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import { FilterQuery, Model } from 'mongoose';

import { UserService } from '../user/user.service';
import { UserRole } from '../user/role.enum';
import { User, UserDocument } from 'src/user/user.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    private readonly userService: UserService,
  ) {}

  async create(payload: { user; otp?: string }): Promise<Customer> {
    try {
      const findCustomer = await this.customerModel.findOne({
        mobile: payload.user.mobile,
      });
      if (findCustomer) {
        throw new Error('Cannot add duplicate Mobile Number!!');
      }
      const customer = await new this.customerModel(payload.user);

      const newUser = await this.userService.create({
        mobile: payload.user.mobile,
        otp: payload.otp,
        name: payload.user.firstName,
        role: UserRole.CUSTOMER,
      });

      return customer.save();
      // return;
    } catch (err) {
      return err.message;
    }
  }

  async findOne(filterQuery: FilterQuery<CustomerDocument>): Promise<any> {
    return this.customerModel.findOne(filterQuery);
  }
}

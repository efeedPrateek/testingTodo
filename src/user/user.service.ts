import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(payload): Promise<User> {
    const user = await new this.userModel(payload);
    return user.save();
  }

  async findOne(filterQuery: FilterQuery<UserDocument>): Promise<User> {
    return this.userModel.findOne(filterQuery);
  }
  async findById(filterQuery: FilterQuery<UserDocument>): Promise<User> {
    return this.userModel.findOne(filterQuery);
  }
  async find(filter: FilterQuery<UserDocument>): Promise<User[]> {
    return this.userModel.find(filter);
  }

  async update(uuid: string, customer: any): Promise<any> {
    return await this.userModel.findOneAndUpdate({ uuid }, customer, {
      new: true,
    });
  }
  async updateByRole(
    mobile: string,
    role: string,
    customer: any,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate({ mobile, role }, customer);
  }
  async updateByQuery(query: any, customer: any): Promise<User> {
    return this.userModel.findOneAndUpdate(query, customer);
  }
}

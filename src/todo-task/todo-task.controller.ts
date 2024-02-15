import {
  BadRequestException,
  Body,
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
import { Controller } from '@nestjs/common';
import { TodoTaskService } from './todo-task.service';
import { UserRole } from 'src/user/role.enum';
import { AuthCustomerService } from '../auth/auth-customer/auth-customer.service';
import { Roles } from '../service/decorators/roles.decorator';
import { AuthCustomerGuard } from '../auth/auth-customer/auth-customer.guard';
import { RolesGuard } from '../service/guards/roles.guard';
import { User } from 'src/user/user.schema';

@Controller('todo-task')
export class TodoTaskController {
  constructor(private readonly todoTaskService: TodoTaskService) {}

  @Roles(UserRole.CUSTOMER)
  @UseGuards(AuthCustomerGuard, RolesGuard)
  @Post('/')
  async create(@Req() req, @Body() payload): Promise<User> {
    return this.todoTaskService.create(payload, req.user._id);
  }

  @Roles(UserRole.CUSTOMER)
  @UseGuards(AuthCustomerGuard, RolesGuard)
  @Get('/')
  async get(@Req() req, @Query() payload): Promise<User> {
    return this.todoTaskService.find(payload, req.user._id);
  }

  @Roles(UserRole.CUSTOMER)
  @UseGuards(AuthCustomerGuard, RolesGuard)
  @Post('/updateTask')
  async update(@Req() req, @Body() payload): Promise<User> {
    return this.todoTaskService.updateTask(payload, req.user._id);
  }

  @Roles(UserRole.CUSTOMER)
  @UseGuards(AuthCustomerGuard, RolesGuard)
  @Post('/deleteTask')
  async delete(@Req() req, @Body() payload): Promise<User> {
    return this.todoTaskService.deleteTask(payload, req.user._id);
  }
}

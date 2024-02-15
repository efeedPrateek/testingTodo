import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthCustomerService } from '../auth/auth-customer/auth-customer.service';
import { HttpModule } from '@nestjs/axios';
import { RolesGuard } from '../service/guards/roles.guard';
import { AuthAdminService } from '../auth/auth-admin/auth-admin.service';
import { SmsService } from 'src/service/sendSms';
import { TodoTask, TodoTaskSchema } from './todo.schema';
import { TodoTaskController } from './todo-task.controller';
import { TodoTaskService } from './todo-task.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TodoTask.name, schema: TodoTaskSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('PASS_SECRET'),
        signOptions: { expiresIn: configService.get('TOKENTIME') },
      }),
    }),
    HttpModule,
  ],
  controllers: [TodoTaskController],
  providers: [TodoTaskService, AuthAdminService, SmsService, RolesGuard],
  exports: [],
})
export class TodoTaskModule {}

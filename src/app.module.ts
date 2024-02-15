import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';
import { CustomerModule } from './customer/customer.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { TodoTaskController } from './todo-task/todo-task.controller';
import { TodoTaskService } from './todo-task/todo-task.service';
import { TodoTaskModule } from './todo-task/todo-task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.ENV === 'local'
        ? 'mongodb://localhost:27017/efeed'
        : process.env.DATABASE_URL,
    ),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('PASS_SECRET'),
        signOptions: { expiresIn: configService.get('TOKENTIME') },
      }),
    }),
    AdminModule,
    CustomerModule,
    UserModule,
    TodoTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

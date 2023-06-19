import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesModule } from '../role/roles.module';

import { UserController } from './user.controller';

import { UserService } from './user.service';

import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

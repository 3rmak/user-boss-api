import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { resolve } from 'path';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RolesModule } from './modules/role/roles.module';
import { DatabaseModule } from './database/database.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(process.cwd(), 'configs', `.${process.env.NODE_ENV}.env`),
      isGlobal: true,
    }),
    DatabaseModule.registerAsync(process.env.NODE_ENV),
    AuthModule,
    RolesModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

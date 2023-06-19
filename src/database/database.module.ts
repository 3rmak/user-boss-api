import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { resolve } from 'path';

import { Role } from '../modules/role/entity/role.entity';
import { User } from '../modules/user/entity/user.entity';

@Module({})
export class DatabaseModule {
  static registerAsync(nodeEnv: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            ({
              type: configService.get<string>('DB_TYPE'),
              host: configService.get<string>('DB_HOST'),
              port: Number(configService.get('DB_PORT')),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_NAME'),
              entities: [Role, User],
              autoLoadEntities: true,
              migrations: this.getMigrationsPath(nodeEnv),
              migrationsRun: true,
              synchronize: true,
            } as TypeOrmModuleOptions),
        }),
      ],
    };
  }

  private static getMigrationsPath(nodeEnv: string): string[] {
    const allMigrations = [resolve(__dirname, 'migrations/*.js')];
    return nodeEnv === 'test' ? [] : allMigrations;
  }
}

import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common/decorators';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { RolesService } from '../role/roles.service';
import { PaginationTypeOrmResponseDto } from '../../shared/utils/pagination.utility';

import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDependencyDto } from './dto/update-user-dependency.dto';
import { RolesEnum } from '../role/entity/roles.enum';
import { FilteredResponseDto } from '../../shared/dto/filtered-response.dto';

@Injectable()
export class UserService {
  private adminUserId: string;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private configService: ConfigService,
    private rolesService: RolesService,
    private readonly entityManager: EntityManager,
  ) {
    this.adminUserId = configService.get<string>('DB_ADMINISTRATOR_USER_ID');
  }

  public async createUser(userId: string, body: CreateUserDto): Promise<User> {
    const userCandidate = await this.getUserByEmail(body.email);
    if (userCandidate) {
      throw new BadRequestException('User with this email already exists');
    }

    try {
      const clerkRole = await this.rolesService.getRoleByValue(RolesEnum.CLERK);

      const password = await this.hashPassword(body.password);
      const user = await this.userRepository.create({
        ...body,
        password,
        bossId: userId,
        role: clerkRole,
      });

      return this.userRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException(`Can't create user. Error: ${e.message}`);
    }
  }

  public async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { boss: true },
    });
    if (!user) {
      throw new NotFoundException(`Can't find user with id: ${userId}`);
    }

    return user;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    return user;
  }

  public async getUsersList(
    userId: string,
    query: PaginationTypeOrmResponseDto,
  ): Promise<FilteredResponseDto<User>> {
    const { take, skip } = query;
    try {
      const [data, total] = await this.userRepository.findAndCount({
        where: [{ bossId: userId }, { id: userId }],
        take,
        skip,
      });

      return { data, total };
    } catch (e) {
      throw new InternalServerErrorException(`Can't retrieve users from db`);
    }
  }

  public async updateUserDependency(userId: string, dto: UpdateUserDependencyDto): Promise<User> {
    const user = await this.getUserById(userId);
    const clerk = await this.getUserById(dto.clerkId);

    if (user.id !== clerk.boss.id && user.id !== this.adminUserId) {
      throw new ForbiddenException(`you don't have permission to change user's boss`);
    }

    if (clerk.boss.id === dto.bossId) {
      return clerk;
    }

    const bossRole = await this.rolesService.getRoleByValue(RolesEnum.BOSS);

    try {
      return await this.entityManager.transaction(async (dbTransactionManager) => {
        const boss = await this.getUserById(dto.bossId);
        clerk.boss = boss;
        await dbTransactionManager.save(clerk);

        boss.role = bossRole;
        await dbTransactionManager.save(boss);

        return clerk;
      });
    } catch (e) {
      throw new InternalServerErrorException(`Can't update user profile. Error: ${e.message}`);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}

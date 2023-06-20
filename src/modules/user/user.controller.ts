import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { UserService } from './user.service';
import { RolesGuard } from '../auth/roles-guard';
import { Roles } from '../auth/role-auth.decorator';
import { RequestUser } from '../../shared/decorators/user.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { PayloadUser } from '../../shared/payload-user.interface';
import { RolesEnum } from '../role/entity/roles.enum';
import { UpdateUserDependencyDto } from './dto/update-user-dependency.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto } from '../../shared/pagination.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { PaginationUtility } from '../../shared/utils/pagination.utility';
import { JwtResolveGuard } from '../auth/jwt-resolve.guard';
import { User } from './entity/user.entity';

@ApiTags('User')
@Controller('users')
export class UserController {
  private paginationUtil: PaginationUtility;

  constructor(private readonly usersService: UserService, private configService: ConfigService) {
    const defaultPerPage = Number(configService.get('DEFAULT_PER_PAGE'));
    this.paginationUtil = new PaginationUtility(defaultPerPage);
  }

  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMINISTRATOR, RolesEnum.BOSS)
  @ApiOperation({ description: 'create user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  public async createUser(
    @Body() body: CreateUserDto,
    @RequestUser() user: PayloadUser,
  ): Promise<UserResponseDto> {
    const createdUser = await this.usersService.createUser(user.id, body);
    return createdUser.toDto();
  }

  @Get('/list')
  @UseGuards(JwtResolveGuard)
  @ApiOperation({ description: 'get user list' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<UserResponseDto> })
  public async getUsers(
    @Query() query: PaginationDto,
    @RequestUser() user: PayloadUser,
  ): Promise<PaginatedResponseDto<User>> {
    const typeOrmQuery = this.paginationUtil.parse(query);
    const { data, total } = await this.usersService.getUsersList(user.id, typeOrmQuery);

    return {
      page: typeOrmQuery.page,
      perPage: typeOrmQuery.take,
      totalPages: Math.ceil(total / typeOrmQuery.take),
      total,
      data,
    };
  }

  @Patch('/dependency')
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMINISTRATOR, RolesEnum.BOSS)
  @ApiOperation({ description: 'get user list' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  public async updateUserProfile(
    @Body() dto: UpdateUserDependencyDto,
    @RequestUser() user: PayloadUser,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateUserDependency(user.id, dto);
    return updatedUser.toDto();
  }
}

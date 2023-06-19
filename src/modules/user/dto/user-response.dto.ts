import { ApiProperty } from '@nestjs/swagger';

import { User } from '../entity/user.entity';

import { RolesEnum } from '../../role/entity/roles.enum';

export class UserResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.role = user.role.value;
    this.bossId = user.bossId;
  }

  @ApiProperty({ example: 'user-uuid-string' })
  public id: string;

  @ApiProperty({ example: 'email@gmail.com' })
  public email: string;

  @ApiProperty({ example: 'user-uuid-string' })
  public fullName: string;

  @ApiProperty({ example: 'user-uuid-string' })
  public role: RolesEnum;

  @ApiProperty({ example: 'user-uuid-string' })
  public bossId: string;
}

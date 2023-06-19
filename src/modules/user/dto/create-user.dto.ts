import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

import { UserPasswordRegex } from '../entity/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'email address is not valid' })
  @ApiProperty({ example: 'email@gmail.com' })
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(UserPasswordRegex)
  @ApiProperty({ example: 'EightSym8olsAtLea7s' })
  public password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Winston Smith' })
  public fullName?: string;
}

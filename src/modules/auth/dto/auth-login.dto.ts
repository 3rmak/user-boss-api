import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserPasswordRegex } from '../../user/entity/user.entity';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'email address is not valid' })
  @ApiProperty({ example: 'email@gmail.com' })
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(UserPasswordRegex)
  @ApiProperty({ example: 'email@gmail.com' })
  public password: string;
}

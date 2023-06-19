import { User } from '../../user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class AuthResponseDto {
  constructor(user: User, token: string) {
    this.user = user.toDto();
    this.token = token;
  }

  @ApiProperty({ description: 'user data' })
  public user: UserResponseDto;

  @ApiProperty({ example: 'eFn4nv...' })
  public token: string;
}

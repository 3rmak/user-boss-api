import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class UpdateUserDependencyDto {
  @IsDefined()
  @IsUUID()
  @ApiProperty({ example: 'new-boss-uuid' })
  bossId: string;

  @IsDefined()
  @IsUUID()
  @ApiProperty({ example: 'target-user-uuid' })
  subordinateId: string;
}

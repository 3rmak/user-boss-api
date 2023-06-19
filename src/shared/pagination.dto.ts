import { IsPositive, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty({ example: 1 })
  public page?: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty({ example: 10 })
  public per_page?: number;
}

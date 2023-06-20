import { IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @Transform((value) => +value.value.trim())
  @IsOptional()
  @Min(1)
  @ApiProperty({ example: 1 })
  public page?: number;

  @Transform((value) => +value.value.trim())
  @IsOptional()
  @Min(1)
  @ApiProperty({ example: 10 })
  public per_page?: number;
}

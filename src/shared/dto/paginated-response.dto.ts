import { ApiProperty } from '@nestjs/swagger';

import { FilteredResponseDto } from './filtered-response.dto';

export class PaginatedResponseDto<T> implements FilteredResponseDto<T> {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 17 })
  total: number;

  @ApiProperty({ example: 2 })
  totalPages: number;

  @ApiProperty({ description: '[user, user, ...]' })
  data: Array<T>;
}

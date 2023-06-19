import { Controller, Get } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

class HealthCheckResponse {
  @ApiProperty({ example: 'alive' })
  message: string;
}

@ApiTags('HealthCheck')
@Controller()
export class AppController {
  @Get('/healthcheck')
  @ApiResponse({ type: HealthCheckResponse })
  getHello(): HealthCheckResponse {
    return { message: 'alive' };
  }
}

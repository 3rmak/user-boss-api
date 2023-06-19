import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthResponseDto } from './dto/auth.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ description: 'user sign in' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  public async login(@Body() body: AuthLoginDto): Promise<AuthResponseDto> {
    return this.authService.login(body);
  }
}

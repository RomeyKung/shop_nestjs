import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CurrentUser } from './decorators/get-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

@ApiTags('1. Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'This endpoint allows users to log in by providing credentials and receive an access token if successful.',
  })
  @ApiBody({ type: LoginAuthDto })
  @UseGuards(LocalGuard)
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    example: {
      Authentication: 'jwt.token.here',
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'User logout',
    description:
      'This endpoint logs out the currently authenticated user and invalidates the session.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout(response);
    return { message: 'Logged out successfully' };
  }
}

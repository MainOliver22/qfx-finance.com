import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService, AuthUser } from './auth.service';
import { AdminGuard } from './admin.guard';
import { JwtGuard } from './jwt.guard';

interface LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  health() {
    return { ok: true };
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    const user = this.authService.validateCredentials(body.username, body.password);
    const accessToken = this.authService.signToken(user);

    return {
      accessToken,
      user,
    };
  }

  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() req: Request) {
    return (req as Request & { user?: AuthUser }).user;
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('admin')
  admin() {
    return { ok: true, scope: 'admin' };
  }
}

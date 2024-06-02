import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.login(loginDto);
    if (!tokens) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return tokens;
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const newToken = await this.authService.refresh(refreshToken);
    if (!newToken) {
      throw new UnauthorizedException('Invalid token');
    }
    return newToken;
  }
}

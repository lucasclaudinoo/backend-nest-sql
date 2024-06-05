import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto);

    if (!tokens) {
      throw new UnauthorizedException('Invalid credentials');
    }

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    console.log('Login successful');
    return res.json({ accessToken: tokens.accessToken, userId: tokens.userId });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const newToken = await this.authService.refresh(refreshToken);
    if (!newToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return res.json({ accessToken: newToken });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  }
}

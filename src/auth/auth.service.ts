import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(users)
    private usersRepository: Repository<users>,
    private jwtService: JwtService,
  ) {
    this.createMockUser();
  }


  async createMockUser() {
    const mockUserDto: CreateUserDto = {
      email: '123@123.com',
      password: '123'
    };
  
    const existingUser = await this.usersRepository.findOne({ where: { email: mockUserDto.email } });
    
    console.log('existingUser', existingUser);
    if (!existingUser) {
      this.register(mockUserDto);
    }
  }

    async register(createUserDto: CreateUserDto): Promise<users> {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = new users();
      user.email = createUserDto.email;
      user.password = hashedPassword;
      await this.usersRepository.save(user);
      return user;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
    console.log('Login attempt', loginDto);
    const users = await this.usersRepository.find({ where: { email: loginDto.email } });
    if (users.length > 0 && await bcrypt.compare(loginDto.password, users[0].password)) {
      const payload = { username: users[0].email, sub: users[0].id };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
      console.log('Login successful');
      return { accessToken, refreshToken };
    }
    console.log('Invalid credentials');
    throw new UnauthorizedException('Invalid credentials');
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersRepository.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      const newAccessToken = this.jwtService.sign({ username: user.email, sub: user.id });
      return { accessToken: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

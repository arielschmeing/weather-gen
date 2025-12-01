import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from './dto/login.request';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: LoginRequest): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Wrong email or password', {
        cause: new Error(),
        description: 'Email or password are not valid.',
      });
    }

    const payload = { sub: user._id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

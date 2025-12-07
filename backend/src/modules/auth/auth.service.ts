import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from './dto/login.request';
import * as bcrypt from 'bcryptjs';
import { ForbiddenUserException } from 'src/exceptions';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: LoginRequest): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findByEmail(email);

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = { sub: user._id, email: user.email };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof ForbiddenUserException) {
        throw new UnauthorizedException('Invalid email or password');
      }
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Error during user login: ${email}`, error);
      throw new UnauthorizedException('Error performing login');
    }
  }
}

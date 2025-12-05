import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.schema';

@Injectable()
export class WeatherGuard implements CanActivate {
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService<Env>) {
    this.apiKey = this.config.getOrThrow('API_KEY');
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'] as string;

    if (!apiKey || apiKey != this.apiKey) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

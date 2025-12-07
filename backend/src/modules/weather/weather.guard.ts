import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.schema';

@Injectable()
export class WeatherGuard implements CanActivate {
  private readonly logger = new Logger(WeatherGuard.name);
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService<Env>) {
    this.apiKey = this.config.getOrThrow('API_KEY');
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'] as string;

    if (!apiKey) {
      this.logger.warn('Access attempt without API Key');
      throw new UnauthorizedException('API Key not provided');
    }

    if (apiKey !== this.apiKey) {
      this.logger.warn('Access attempt with invalid API Key');
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}

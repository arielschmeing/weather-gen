import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class WeatherGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    console.log(request.headers);
    const apiKey = request.headers['api-key'] as string;

    if (!apiKey || apiKey != process.env.API_KEY) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

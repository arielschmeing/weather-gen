import { forwardRef, Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WeatherModule } from '../weather/weather.module';

@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => WeatherModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

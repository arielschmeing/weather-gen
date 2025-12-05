import { forwardRef, Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WeatherModule } from '../weather/weather.module';
import { ExplorerModule } from '../explorer/explorer.module';
import { Env } from 'src/config/env.schema';

@Global()
@Module({
  imports: [
    forwardRef(() => ExplorerModule),
    forwardRef(() => UsersModule),
    forwardRef(() => WeatherModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<Env>) => ({
        global: true,
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: config.getOrThrow('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

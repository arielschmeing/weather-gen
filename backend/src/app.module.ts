import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { Env, envSchema } from './config/env.schema';
import { ExplorerModule } from './modules/explorer/explorer.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const parsed = envSchema.safeParse(env);
        if (!parsed.success) throw new Error('Invalid environment variables');
        return parsed.data;
      },
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService<Env>) => ({
        uri: `mongodb://${config.getOrThrow('MONGODB_USER')}:${config.getOrThrow('MONGODB_PASSWORD')}@database:${config.getOrThrow('DB_PORT')}/admin?authSource=admin`,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    ExplorerModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

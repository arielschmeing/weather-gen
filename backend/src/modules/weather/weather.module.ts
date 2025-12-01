import { forwardRef, Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './weather.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [WeatherService],
})
export class WeatherModule {}

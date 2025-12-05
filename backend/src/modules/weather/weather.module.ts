import { forwardRef, Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './schemas/weather.schema';
import { WeatherFileService } from './weather-file.service';
import { AICoreModule } from '../ai-core/aiCore.module';
import { AICoreMapper } from './mapper/ai-core.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
    forwardRef(() => AuthModule),
    AICoreModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherFileService, AICoreMapper],
  exports: [WeatherService],
})
export class WeatherModule {}

import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherRequest } from './dto/weather.request';
import type { Response } from 'express';
import { Insights, InsightsSchema } from './dto/insight';
import { WeatherFileService } from './weather-file.service';
import { AICoreService } from '../ai-core/aiCore.service';
import { insightsPrompt } from '../ai-core/prompt/insights.prompt';
import { AICoreMapper } from './mapper/ai-core.mapper';
import { DatabaseException, AIServiceException } from 'src/exceptions';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
    private readonly weatherFileService: WeatherFileService,
    private readonly aiCoreService: AICoreService,
    private readonly aiCoreMapper: AICoreMapper,
  ) {}

  async create(weather: WeatherRequest): Promise<void> {
    try {
      const newWeather = new this.weatherModel(weather);
      await newWeather.save();
    } catch (error) {
      this.logger.error('Error creating weather record', error);
      throw new DatabaseException('Error saving weather data');
    }
  }

  async list(): Promise<Weather[]> {
    try {
      return await this.weatherModel.find().exec();
    } catch (error) {
      this.logger.error('Error listing weather records', error);
      throw new DatabaseException('Error fetching weather data');
    }
  }

  async exportCSV(res: Response): Promise<void> {
    try {
      const weatherLogs = await this.list();
      return this.weatherFileService.defaultExport('csv', res, weatherLogs);
    } catch (error) {
      this.logger.error('Error exporting CSV', error);
      if (error instanceof DatabaseException) throw error;
      throw new InternalServerErrorException('Error generating CSV file');
    }
  }

  async exportXLSX(res: Response): Promise<void> {
    try {
      const weatherLogs = await this.list();
      return this.weatherFileService.defaultExport('xlsx', res, weatherLogs);
    } catch (error) {
      this.logger.error('Error exporting XLSX', error);
      if (error instanceof DatabaseException) throw error;
      throw new InternalServerErrorException('Error generating XLSX file');
    }
  }

  async insight(): Promise<Insights> {
    try {
      const weatherLogs = await this.list();

      if (weatherLogs.length === 0) {
        throw new AIServiceException(
          'Insufficient weather data to generate insights',
        );
      }

      const result = await this.aiCoreService.ask(insightsPrompt(weatherLogs));
      const parsed = InsightsSchema.parse(
        JSON.parse(this.aiCoreMapper.toResponse(result)),
      );

      return parsed;
    } catch (error) {
      this.logger.error('Error generating insights', error);
      if (
        error instanceof DatabaseException ||
        error instanceof AIServiceException
      ) {
        throw error;
      }
      throw new AIServiceException('Error processing weather insights');
    }
  }
}

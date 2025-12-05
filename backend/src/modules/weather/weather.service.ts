import { Injectable } from '@nestjs/common';
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
@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
    private readonly weatherFileService: WeatherFileService,
    private readonly aiCoreService: AICoreService,
    private readonly aiCoreMapper: AICoreMapper,
  ) {}

  async create(weather: WeatherRequest): Promise<void> {
    const newWeather = new this.weatherModel(weather);
    await newWeather.save();

    return;
  }

  async list(): Promise<Weather[]> {
    return await this.weatherModel.find().exec();
  }

  async exportCSV(res: Response): Promise<void> {
    const weatherLogs = await this.list();

    return this.weatherFileService.defaultExport('csv', res, weatherLogs);
  }

  async exportXLSX(res: Response): Promise<void> {
    const weatherLogs = await this.list();

    return this.weatherFileService.defaultExport('xlsx', res, weatherLogs);
  }

  async insight(): Promise<Insights> {
    const weatherLogs = await this.list();

    const result = await this.aiCoreService.ask(insightsPrompt(weatherLogs));
    const parsed = InsightsSchema.parse(
      JSON.parse(this.aiCoreMapper.toResponse(result)),
    );

    return parsed;
  }
}

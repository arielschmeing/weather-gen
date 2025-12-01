import { Injectable } from '@nestjs/common';
import { Weather, WeatherDocument } from './weather.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherRequest } from './dto/weather.request';
import * as XLSX from 'xlsx';
import type { Response } from 'express';
import { InsightResponse } from './dto/insight.response';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { insight } from './prompts/insight';

type FileTypes = 'xlsx' | 'csv';

@Injectable()
export class WeatherService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
    private configService: ConfigService,
  ) {
    const keyAI = this.configService.get<string>('AI_API_KEY');

    if (!keyAI) throw new Error('AI Key is missing in environment variables.');

    this.genAI = new GoogleGenerativeAI(keyAI);
  }

  async create(weather: WeatherRequest): Promise<void> {
    const newWeather = new this.weatherModel(weather);
    await newWeather.save();

    return;
  }

  async list(): Promise<Weather[]> {
    return await this.weatherModel.find().exec();
  }

  async exportCSV(res: Response): Promise<void> {
    return this.defaultExport('csv', res);
  }

  async exportXLSX(res: Response): Promise<void> {
    return this.defaultExport('xlsx', res);
  }

  async insight(): Promise<InsightResponse> {
    const weatherLogs = await this.list();
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const result = await model.generateContent(insight(weatherLogs));
    const response = result.response
      .text()
      .trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const data = JSON.parse(response) as InsightResponse;

    return {
      averageTemperature: data.averageTemperature ?? 0,
      averageHumidity: data.averageHumidity ?? 0,
      temperatureTrend: data.temperatureTrend ?? 'estável',
      comfortScore: data.comfortScore ?? 0,
      dayClassification: data.dayClassification ?? 'indefinido',
      alerts: Array.isArray(data.alerts) ? data.alerts : [],
      summary: data.summary ?? '',
    };
  }

  private async defaultExport(format: FileTypes, res: Response): Promise<void> {
    const weather_logs = await this.list();

    const cleanedData: Weather[] = weather_logs.map((log) => {
      const cleanLog = JSON.parse(JSON.stringify(log)) as Weather;
      return cleanLog;
    });

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(cleanedData),
      'Data',
    );

    const buffer = XLSX.write(wb, {
      type: 'buffer',
      bookType: format,
    }) as Buffer;

    this.setFile(format, res, buffer);
  }

  private setFile(format: FileTypes, res: Response, buffer: Buffer): void {
    const contentType =
      format === 'csv'
        ? 'text/csv'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="weather_logs.${format}"`,
    );
    res.send(buffer);
  }
}

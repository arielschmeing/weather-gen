import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from 'src/modules/weather/weather.controller';
import { WeatherService } from 'src/modules/weather/weather.service';
import { WeatherRequest } from 'src/modules/weather/dto/weather.request';
import { Response } from 'express';
import { WeatherGuard } from 'src/modules/weather/weather.guard';
import { AuthGuard } from 'src/modules/auth/auth.guard';

describe('WeatherController', () => {
  let weatherController: WeatherController;

  const mockCreate = jest.fn();
  const mockList = jest.fn();
  const mockExportCSV = jest.fn();
  const mockExportXLSX = jest.fn();
  const mockInsight = jest.fn();

  const mockDate = new Date('2024-01-01');
  const mockWeather = {
    createdAt: mockDate,
    latitude: -23.5505,
    longitude: -46.6333,
    temperature: 25,
    umidade: 65,
    wind: 10,
    sky: 1,
    precipitation_probability: 20,
  };

  beforeEach(async () => {
    const mockWeatherService: Partial<WeatherService> = {
      create: mockCreate,
      list: mockList,
      exportCSV: mockExportCSV,
      exportXLSX: mockExportXLSX,
      insight: mockInsight,
    };

    const mockGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [{ provide: WeatherService, useValue: mockWeatherService }],
    })
      .overrideGuard(WeatherGuard)
      .useValue(mockGuard)
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    weatherController = module.get<WeatherController>(WeatherController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new weather log', async () => {
      const weatherRequest: WeatherRequest = {
        latitude: -23.5505,
        longitude: -46.6333,
        temperature: 25,
        umidade: 65,
        wind: 10,
        sky: 1,
        precipitation_probability: 20,
      };

      mockCreate.mockResolvedValue(undefined);

      await weatherController.create(weatherRequest);

      expect(mockCreate).toHaveBeenCalledWith(weatherRequest);
    });
  });

  describe('list', () => {
    it('should return list of weather logs', async () => {
      const mockWeatherLogs = [
        mockWeather,
        { ...mockWeather, temperature: 30 },
      ];

      mockList.mockResolvedValue(mockWeatherLogs);

      const result = await weatherController.list();

      expect(mockList).toHaveBeenCalled();
      expect(result).toEqual(mockWeatherLogs);
    });
  });

  describe('exportCSV', () => {
    it('should call service exportCSV with response object', async () => {
      const mockRes = {} as Response;

      mockExportCSV.mockResolvedValue(undefined);

      await weatherController.exportCSV(mockRes);

      expect(mockExportCSV).toHaveBeenCalledWith(mockRes);
    });
  });

  describe('exportXLSX', () => {
    it('should call service exportXLSX with response object', async () => {
      const mockRes = {} as Response;

      mockExportXLSX.mockResolvedValue(undefined);

      await weatherController.exportXLSX(mockRes);

      expect(mockExportXLSX).toHaveBeenCalledWith(mockRes);
    });
  });

  describe('insight', () => {
    it('should return AI generated insights', async () => {
      const mockInsights = {
        averageTemperature: 25,
        averageHumidity: 65,
        temperatureTrend: 'stable',
        comfortScore: 8,
        dayClassification: 'pleasant',
        alerts: [],
        summary: 'Nice day',
      };

      mockInsight.mockResolvedValue(mockInsights);

      const result = await weatherController.insight();

      expect(mockInsight).toHaveBeenCalled();
      expect(result).toEqual(mockInsights);
    });
  });
});



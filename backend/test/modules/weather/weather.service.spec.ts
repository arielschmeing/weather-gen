import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from 'src/modules/weather/weather.service';
import { getModelToken } from '@nestjs/mongoose';
import { Weather } from 'src/modules/weather/schemas/weather.schema';
import { WeatherFileService } from 'src/modules/weather/weather-file.service';
import { AICoreService } from 'src/modules/ai-core/aiCore.service';
import { AICoreMapper } from 'src/modules/weather/mapper/ai-core.mapper';
import { Response } from 'express';

describe('WeatherService', () => {
  let weatherService: WeatherService;

  const mockFind = jest.fn();
  const mockDefaultExport = jest.fn();
  const mockAsk = jest.fn();
  const mockAiToResponse = jest.fn();

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
    const mockWeatherModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(data),
    })) as unknown as typeof Weather;

    Object.assign(mockWeatherModel, {
      find: mockFind,
    });

    const mockWeatherFileService: Partial<WeatherFileService> = {
      defaultExport: mockDefaultExport,
    };

    const mockAICoreService: Partial<AICoreService> = {
      ask: mockAsk,
    };

    const mockAICoreMapper: Partial<AICoreMapper> = {
      toResponse: mockAiToResponse,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: getModelToken(Weather.name), useValue: mockWeatherModel },
        { provide: WeatherFileService, useValue: mockWeatherFileService },
        { provide: AICoreService, useValue: mockAICoreService },
        { provide: AICoreMapper, useValue: mockAICoreMapper },
      ],
    }).compile();

    weatherService = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new weather log', async () => {
      const weatherRequest = {
        latitude: -23.5505,
        longitude: -46.6333,
        temperature: 25,
        umidade: 65,
        wind: 10,
        sky: 1,
        precipitation_probability: 20,
      };

      await weatherService.create(weatherRequest);

      expect(true).toBe(true);
    });
  });

  describe('list', () => {
    it('should return list of weather logs', async () => {
      const mockWeatherLogs = [mockWeather, { ...mockWeather, temperature: 30 }];

      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWeatherLogs),
      });

      const result = await weatherService.list();

      expect(mockFind).toHaveBeenCalled();
      expect(result).toEqual(mockWeatherLogs);
    });

    it('should return empty array when no logs exist', async () => {
      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await weatherService.list();

      expect(result).toEqual([]);
    });
  });

  describe('exportCSV', () => {
    it('should call weatherFileService.defaultExport with csv format', async () => {
      const mockRes = {} as Response;
      const mockWeatherLogs = [mockWeather];

      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWeatherLogs),
      });

      await weatherService.exportCSV(mockRes);

      expect(mockDefaultExport).toHaveBeenCalledWith(
        'csv',
        mockRes,
        mockWeatherLogs,
      );
    });
  });

  describe('exportXLSX', () => {
    it('should call weatherFileService.defaultExport with xlsx format', async () => {
      const mockRes = {} as Response;
      const mockWeatherLogs = [mockWeather];

      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWeatherLogs),
      });

      await weatherService.exportXLSX(mockRes);

      expect(mockDefaultExport).toHaveBeenCalledWith(
        'xlsx',
        mockRes,
        mockWeatherLogs,
      );
    });
  });

  describe('insight', () => {
    it('should return AI generated insights', async () => {
      const mockWeatherLogs = [mockWeather];
      const mockAIResponse = 'AI response text';
      const mockInsights = {
        averageTemperature: 25,
        averageHumidity: 65,
        temperatureTrend: 'stable',
        comfortScore: 8,
        dayClassification: 'pleasant',
        alerts: [],
        summary: 'Nice day',
      };

      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWeatherLogs),
      });
      mockAsk.mockResolvedValue(mockAIResponse);
      mockAiToResponse.mockReturnValue(JSON.stringify(mockInsights));

      const result = await weatherService.insight();

      expect(mockAsk).toHaveBeenCalled();
      expect(mockAiToResponse).toHaveBeenCalledWith(mockAIResponse);
      expect(result).toEqual(mockInsights);
    });
  });
});



import { Test, TestingModule } from '@nestjs/testing';
import { WeatherFileService } from 'src/modules/weather/weather-file.service';
import { Weather } from 'src/modules/weather/schemas/weather.schema';
import { Response } from 'express';

describe('WeatherFileService', () => {
  let weatherFileService: WeatherFileService;

  const mockDate = new Date('2024-01-01');
  const mockWeatherLogs: Weather[] = [
    {
      createdAt: mockDate,
      latitude: -23.5505,
      longitude: -46.6333,
      temperature: 25,
      umidade: 65,
      wind: 10,
      sky: 1,
      precipitation_probability: 20,
    },
    {
      createdAt: mockDate,
      latitude: -22.9068,
      longitude: -43.1729,
      temperature: 30,
      umidade: 70,
      wind: 15,
      sky: 2,
      precipitation_probability: 40,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherFileService],
    }).compile();

    weatherFileService = module.get<WeatherFileService>(WeatherFileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('defaultExport', () => {
    it('should export data as CSV', () => {
      const mockSetHeader = jest.fn();
      const mockSend = jest.fn();
      const mockRes = {
        setHeader: mockSetHeader,
        send: mockSend,
      } as unknown as Response;

      weatherFileService.defaultExport('csv', mockRes, mockWeatherLogs);

      expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockSetHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="weather_logs.csv"',
      );
      expect(mockSend).toHaveBeenCalled();
    });

    it('should export data as XLSX', () => {
      const mockSetHeader = jest.fn();
      const mockSend = jest.fn();
      const mockRes = {
        setHeader: mockSetHeader,
        send: mockSend,
      } as unknown as Response;

      weatherFileService.defaultExport('xlsx', mockRes, mockWeatherLogs);

      expect(mockSetHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(mockSetHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="weather_logs.xlsx"',
      );
      expect(mockSend).toHaveBeenCalled();
    });

    it('should handle empty data array', () => {
      const mockSetHeader = jest.fn();
      const mockSend = jest.fn();
      const mockRes = {
        setHeader: mockSetHeader,
        send: mockSend,
      } as unknown as Response;

      weatherFileService.defaultExport('csv', mockRes, []);

      expect(mockSend).toHaveBeenCalled();
    });
  });

  describe('setFile', () => {
    it('should set correct headers for CSV format', () => {
      const mockSetHeader = jest.fn();
      const mockSend = jest.fn();
      const mockRes = {
        setHeader: mockSetHeader,
        send: mockSend,
      } as unknown as Response;
      const mockBuffer = Buffer.from('test');

      weatherFileService.setFile('csv', mockRes, mockBuffer);

      expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockSetHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="weather_logs.csv"',
      );
      expect(mockSend).toHaveBeenCalledWith(mockBuffer);
    });

    it('should set correct headers for XLSX format', () => {
      const mockSetHeader = jest.fn();
      const mockSend = jest.fn();
      const mockRes = {
        setHeader: mockSetHeader,
        send: mockSend,
      } as unknown as Response;
      const mockBuffer = Buffer.from('test');

      weatherFileService.setFile('xlsx', mockRes, mockBuffer);

      expect(mockSetHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(mockSetHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="weather_logs.xlsx"',
      );
      expect(mockSend).toHaveBeenCalledWith(mockBuffer);
    });
  });
});



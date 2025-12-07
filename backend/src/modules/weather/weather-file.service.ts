import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Weather } from './schemas/weather.schema';
import * as XLSX from 'xlsx';
import { Response } from 'express';

type FileTypes = 'xlsx' | 'csv';

@Injectable()
export class WeatherFileService {
  private readonly logger = new Logger(WeatherFileService.name);

  defaultExport(
    format: FileTypes,
    res: Response,
    weatherLogs: Weather[],
  ): void {
    try {
      if (!weatherLogs || weatherLogs.length === 0) {
        throw new InternalServerErrorException('No data to export');
      }

      const cleanedData: Weather[] = weatherLogs.map((log) => {
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
    } catch (error) {
      this.logger.error(`Error exporting ${format} file`, error);
      if (error instanceof InternalServerErrorException) throw error;
      throw new InternalServerErrorException(
        `Error generating ${format.toUpperCase()} file`,
      );
    }
  }

  setFile(format: FileTypes, res: Response, buffer: Buffer): void {
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

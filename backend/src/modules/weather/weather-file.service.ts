import { Injectable } from '@nestjs/common';
import { Weather } from './schemas/weather.schema';
import * as XLSX from 'xlsx';
import { Response } from 'express';

type FileTypes = 'xlsx' | 'csv';

@Injectable()
export class WeatherFileService {
  defaultExport(
    format: FileTypes,
    res: Response,
    weatherLogs: Weather[],
  ): void {
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

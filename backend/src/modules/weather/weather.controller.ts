import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherRequest } from './dto/weather.request';
import { Public } from 'src/decorators/public.decorator';
import { WeatherGuard } from './weather.guard';
import { AuthGuard } from '../auth/auth.guard';
import type { Response } from 'express';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(WeatherGuard)
  @Public()
  @Post('logs')
  create(@Body() request: WeatherRequest) {
    return this.weatherService.create(request);
  }

  @UseGuards(AuthGuard)
  @Get('logs')
  list() {
    return this.weatherService.list();
  }

  @UseGuards(AuthGuard)
  @Get('export.csv')
  exportCSV(@Res() res: Response) {
    return this.weatherService.exportCSV(res);
  }

  @UseGuards(AuthGuard)
  @Get('export.xlsx')
  exportXLSX(@Res() res: Response) {
    return this.weatherService.exportXLSX(res);
  }

  @UseGuards(AuthGuard)
  @Post('insight')
  insight() {
    return this.weatherService.insight();
  }
}

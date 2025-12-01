import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  health() {
    return this.appService.getHello();
  }
}

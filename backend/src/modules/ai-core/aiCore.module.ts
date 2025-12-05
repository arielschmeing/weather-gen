import { Module } from '@nestjs/common';
import { AICoreService } from './aiCore.service';

@Module({
  providers: [AICoreService],
  exports: [AICoreService],
})
export class AICoreModule {}

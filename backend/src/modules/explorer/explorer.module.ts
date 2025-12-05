import { forwardRef, Module } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { ItemMapper } from './mapper/item.mapper';

@Module({
  imports: [forwardRef(() => AuthModule), HttpModule],
  controllers: [ExplorerController],
  providers: [ExplorerService, ItemMapper],
  exports: [ExplorerService],
})
export class ExplorerModule {}

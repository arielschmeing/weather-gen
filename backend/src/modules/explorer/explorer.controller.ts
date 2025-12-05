import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ExplorerService } from './explorer.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('explorer')
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  @UseGuards(AuthGuard)
  @Get('items')
  listItems(
    @Query('offset') offset: number = 20,
    @Query('limit') limit: number = 20,
  ) {
    return this.explorerService.listItems(offset, limit);
  }

  @UseGuards(AuthGuard)
  @Get('items/:id')
  detailItem(@Param('id') id: number) {
    return this.explorerService.detailItem(id);
  }
}

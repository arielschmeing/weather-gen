import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { Env } from 'src/config/env.schema';
import { ItemsPageResponse } from './dto/items-page.response';
import { ItemResponse } from './dto/item.response';
import { RawItemResponse } from './dto/raw-item.response';
import { ItemMapper } from './mapper/item.mapper';
import {
  ExternalApiException,
  ResourceNotFoundException,
} from 'src/exceptions';
import { AxiosError } from 'axios';

@Injectable()
export class ExplorerService {
  private readonly logger = new Logger(ExplorerService.name);
  private readonly publicAPI: string;

  constructor(
    private readonly config: ConfigService<Env>,
    private readonly httpService: HttpService,
    private readonly itemMapper: ItemMapper,
  ) {
    this.publicAPI = this.config.getOrThrow('EXPLORER_API_URL');
  }

  async listItems(offset: number, limit: number): Promise<ItemsPageResponse> {
    try {
      const formatApiURL = new URL(`${this.publicAPI}item/`);

      formatApiURL.searchParams.set('offset', offset.toString());
      formatApiURL.searchParams.set('limit', limit.toString());

      const items = this.httpService.get<ItemsPageResponse>(
        formatApiURL.toString(),
      );
      const { data } = await lastValueFrom(items);

      return this.itemMapper.toEntity(data);
    } catch (error) {
      this.logger.error('Error listing items from external API', error);
      if (error instanceof AxiosError) {
        throw new ExternalApiException(
          'Error fetching items list',
          'Explorer API',
        );
      }
      throw error;
    }
  }

  async detailItem(id: number): Promise<ItemResponse> {
    try {
      const formatApiUrl = new URL(`${this.publicAPI}item/${id}/`);
      const item = this.httpService.get<RawItemResponse>(
        formatApiUrl.toString(),
      );
      const { data } = await lastValueFrom(item);

      return this.itemMapper.toResponse(data);
    } catch (error) {
      this.logger.error(`Error fetching item ${id}`, error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new ResourceNotFoundException('Item', id);
        }
        throw new ExternalApiException(
          'Error fetching item details',
          'Explorer API',
        );
      }
      throw error;
    }
  }
}

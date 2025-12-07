import { Injectable } from '@nestjs/common';
import { RawItemResponse } from '../dto/raw-item.response';
import { ItemResponse } from '../dto/item.response';
import { ItemsPageResponse } from '../dto/items-page.response';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.schema';

const API_URL_QUERYS_INIT = 31;

@Injectable()
export class ItemMapper {
  private readonly baseAPI: string;

  constructor(private readonly config: ConfigService<Env>) {
    this.baseAPI = `${this.config.getOrThrow('API_BASE')}/explorer/items/`;
  }

  toResponse(raw: RawItemResponse): ItemResponse {
    return {
      attributes: raw.attributes.map((a) => a.name),
      category: raw.category.name,
      cost: raw.cost,
      id: raw.id,
      name: raw.name,
      sprite: raw.sprites.default,
    };
  }

  toEntity(response: ItemsPageResponse): ItemsPageResponse {
    const formatNext = response.next?.slice(API_URL_QUERYS_INIT);
    const formatPrevious = response.previous?.slice(API_URL_QUERYS_INIT);
    const formatResults = response.results.map((r) => ({
      ...r,
      url: this.baseAPI + r.url.slice(API_URL_QUERYS_INIT),
    }));

    return {
      ...response,
      next: formatNext ? this.baseAPI + formatNext : null,
      previous: formatPrevious ? this.baseAPI + formatPrevious : null,
      results: formatResults,
    };
  }
}

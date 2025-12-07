import { Test, TestingModule } from '@nestjs/testing';
import { ExplorerService } from 'src/modules/explorer/explorer.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ItemMapper } from 'src/modules/explorer/mapper/item.mapper';
import { of } from 'rxjs';
import { ItemsPageResponse } from 'src/modules/explorer/dto/items-page.response';
import { ItemResponse } from 'src/modules/explorer/dto/item.response';

describe('ExplorerService', () => {
  let explorerService: ExplorerService;

  const mockGet = jest.fn();
  const mockToEntity = jest.fn();
  const mockToResponse = jest.fn();
  const mockGetOrThrow = jest.fn().mockReturnValue('https://api.example.com/');

  const mockItemsPageResponse: ItemsPageResponse = {
    count: 100,
    next: 'https://api.example.com/item/?offset=40&limit=20',
    previous: 'https://api.example.com/item/?offset=0&limit=20',
    results: [
      { name: 'item-1', url: 'https://api.example.com/item/1/' },
      { name: 'item-2', url: 'https://api.example.com/item/2/' },
    ],
  };

  const mockItemResponse: ItemResponse = {
    attributes: ['attribute-1', 'attribute-2'],
    category: 'category-1',
    cost: 100,
    id: 1,
    name: 'item-1',
    sprite: 'https://example.com/sprite.png',
  };

  beforeEach(async () => {
    const mockHttpService: Partial<HttpService> = {
      get: mockGet,
    };

    const mockConfigService: Partial<ConfigService> = {
      getOrThrow: mockGetOrThrow,
    };

    const mockItemMapper: Partial<ItemMapper> = {
      toEntity: mockToEntity,
      toResponse: mockToResponse,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExplorerService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: ItemMapper, useValue: mockItemMapper },
      ],
    }).compile();

    explorerService = module.get<ExplorerService>(ExplorerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listItems', () => {
    it('should return paginated items list', async () => {
      const offset = 20;
      const limit = 20;
      const mappedResponse = { ...mockItemsPageResponse };

      mockGet.mockReturnValue(of({ data: mockItemsPageResponse }));
      mockToEntity.mockReturnValue(mappedResponse);

      const result = await explorerService.listItems(offset, limit);

      expect(mockGet).toHaveBeenCalled();
      expect(mockToEntity).toHaveBeenCalledWith(mockItemsPageResponse);
      expect(result).toEqual(mappedResponse);
    });

    it('should correctly format URL with offset and limit parameters', async () => {
      const offset = 40;
      const limit = 10;

      mockGet.mockReturnValue(of({ data: mockItemsPageResponse }));
      mockToEntity.mockReturnValue(mockItemsPageResponse);

      await explorerService.listItems(offset, limit);

      const calledUrl = (mockGet.mock.calls[0] as [string])[0];
      expect(calledUrl).toContain('offset=40');
      expect(calledUrl).toContain('limit=10');
    });
  });

  describe('detailItem', () => {
    it('should return item details by id', async () => {
      const itemId = 1;
      const rawItemResponse = {
        id: 1,
        name: 'item-1',
        attributes: [{ name: 'attribute-1' }, { name: 'attribute-2' }],
        category: { name: 'category-1' },
        cost: 100,
        sprites: { default: 'https://example.com/sprite.png' },
      };

      mockGet.mockReturnValue(of({ data: rawItemResponse }));
      mockToResponse.mockReturnValue(mockItemResponse);

      const result = await explorerService.detailItem(itemId);

      expect(mockGet).toHaveBeenCalled();
      expect(mockToResponse).toHaveBeenCalledWith(rawItemResponse);
      expect(result).toEqual(mockItemResponse);
    });

    it('should correctly format URL with item id', async () => {
      const itemId = 42;

      mockGet.mockReturnValue(of({ data: {} }));
      mockToResponse.mockReturnValue(mockItemResponse);

      await explorerService.detailItem(itemId);

      const calledUrl = (mockGet.mock.calls[0] as [string])[0];
      expect(calledUrl).toContain('/42/');
    });
  });
});


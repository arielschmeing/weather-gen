import { Test, TestingModule } from '@nestjs/testing';
import { ExplorerController } from 'src/modules/explorer/explorer.controller';
import { ExplorerService } from 'src/modules/explorer/explorer.service';
import { ItemsPageResponse } from 'src/modules/explorer/dto/items-page.response';
import { ItemResponse } from 'src/modules/explorer/dto/item.response';
import { AuthGuard } from 'src/modules/auth/auth.guard';

describe('ExplorerController', () => {
  let explorerController: ExplorerController;

  const mockListItems = jest.fn();
  const mockDetailItem = jest.fn();

  const mockItemsPageResponse: ItemsPageResponse = {
    count: 100,
    next: 'https://api.example.com/explorer/items/?offset=40&limit=20',
    previous: 'https://api.example.com/explorer/items/?offset=0&limit=20',
    results: [
      { name: 'item-1', url: 'https://api.example.com/explorer/items/1/' },
      { name: 'item-2', url: 'https://api.example.com/explorer/items/2/' },
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
    const mockExplorerService: Partial<ExplorerService> = {
      listItems: mockListItems,
      detailItem: mockDetailItem,
    };

    const mockAuthGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExplorerController],
      providers: [{ provide: ExplorerService, useValue: mockExplorerService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    explorerController = module.get<ExplorerController>(ExplorerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listItems', () => {
    it('should return paginated items list with default parameters', async () => {
      mockListItems.mockResolvedValue(mockItemsPageResponse);

      const result = await explorerController.listItems(20, 20);

      expect(mockListItems).toHaveBeenCalledWith(20, 20);
      expect(result).toEqual(mockItemsPageResponse);
    });

    it('should return paginated items list with custom parameters', async () => {
      mockListItems.mockResolvedValue(mockItemsPageResponse);

      const result = await explorerController.listItems(40, 10);

      expect(mockListItems).toHaveBeenCalledWith(40, 10);
      expect(result).toEqual(mockItemsPageResponse);
    });
  });

  describe('detailItem', () => {
    it('should return item details by id', async () => {
      mockDetailItem.mockResolvedValue(mockItemResponse);

      const result = await explorerController.detailItem(1);

      expect(mockDetailItem).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockItemResponse);
    });

    it('should call service with correct id', async () => {
      mockDetailItem.mockResolvedValue(mockItemResponse);

      await explorerController.detailItem(42);

      expect(mockDetailItem).toHaveBeenCalledWith(42);
    });
  });
});


import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/modules/users/users.controller';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserRequest } from 'src/modules/users/dto/create-user.request';
import { AuthRequest } from 'src/modules/auth/dto/auth.request';
import { AuthGuard } from 'src/modules/auth/auth.guard';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockCreate = jest.fn();
  const mockList = jest.fn();
  const mockFindById = jest.fn();
  const mockRemove = jest.fn();
  const mockChangeName = jest.fn();
  const mockChangePassword = jest.fn();

  const mockDate = new Date('2024-01-01');
  const mockUserResponse = {
    id: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockAuthRequest = {
    user: {
      sub: 'user-id-123',
      email: 'test@example.com',
    },
  } as AuthRequest;

  beforeEach(async () => {
    const mockUsersService: Partial<UsersService> = {
      create: mockCreate,
      list: mockList,
      findById: mockFindById,
      remove: mockRemove,
      changeName: mockChangeName,
      changePassword: mockChangePassword,
    };

    const mockAuthGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserRequest: CreateUserRequest = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };

      mockCreate.mockResolvedValue(undefined);

      await usersController.create(createUserRequest);

      expect(mockCreate).toHaveBeenCalledWith(createUserRequest);
    });
  });

  describe('list', () => {
    it('should return list of users', async () => {
      const mockUsers = [
        mockUserResponse,
        { ...mockUserResponse, id: 'user-id-456' },
      ];

      mockList.mockResolvedValue(mockUsers);

      const result = await usersController.list();

      expect(mockList).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('byId', () => {
    it('should return user by id', async () => {
      mockFindById.mockResolvedValue(mockUserResponse);

      const result = await usersController.byId('user-id-123');

      expect(mockFindById).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('remove', () => {
    it('should remove user based on authenticated user email', async () => {
      mockRemove.mockResolvedValue(undefined);

      await usersController.remove(mockAuthRequest);

      expect(mockRemove).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('changeName', () => {
    it('should change user name', async () => {
      const newName = 'Updated Name';
      mockChangeName.mockResolvedValue(undefined);

      await usersController.changeName({ name: newName }, mockAuthRequest);

      expect(mockChangeName).toHaveBeenCalledWith(newName, 'test@example.com');
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const newPassword = 'newPassword123';
      mockChangePassword.mockResolvedValue(undefined);

      await usersController.changePassword(
        { password: newPassword },
        mockAuthRequest,
      );

      expect(mockChangePassword).toHaveBeenCalledWith(
        newPassword,
        'test@example.com',
      );
    });
  });
});


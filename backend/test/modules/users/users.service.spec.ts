import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/modules/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/modules/users/schemas/users.schema';
import { UserMapper } from 'src/modules/users/mapper/user.mapper';
import { BadRequestException } from '@nestjs/common';
import { ForbiddenUserException } from 'src/exceptions/forbidden-user.exception';

const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};

jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  hash: (...args: unknown[]) => mockBcrypt.hash(...args),
  compare: (...args: unknown[]) => mockBcrypt.compare(...args),
}));

describe('UsersService', () => {
  let usersService: UsersService;

  const mockFind = jest.fn();
  const mockFindOne = jest.fn();
  const mockFindById = jest.fn();
  const mockDeleteOne = jest.fn();
  const mockToResponse = jest.fn();

  const mockDate = new Date('2024-01-01');
  const mockUser = {
    _id: 'user-id-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    createdAt: mockDate,
    updatedAt: mockDate,
    save: jest.fn(),
  };

  const mockUserResponse = {
    id: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  beforeEach(async () => {
    const mockUserModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(data),
    })) as unknown as typeof User;

    Object.assign(mockUserModel, {
      find: mockFind,
      findOne: mockFindOne,
      findById: mockFindById,
      deleteOne: mockDeleteOne,
    });

    const mockUserMapper: Partial<UserMapper> = {
      toResponse: mockToResponse,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: UserMapper, useValue: mockUserMapper },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserRequest = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };
      const hashedPassword = 'hashedPassword123';

      mockBcrypt.hash.mockResolvedValue(hashedPassword);

      await usersService.create(createUserRequest);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(
        createUserRequest.password,
        10,
      );
    });
  });

  describe('list', () => {
    it('should return list of users mapped to response', async () => {
      const mockUsers = [mockUser, { ...mockUser, _id: 'user-id-456' }];

      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUsers),
      });
      mockToResponse.mockReturnValue(mockUserResponse);

      const result = await usersService.list();

      expect(mockFind).toHaveBeenCalled();
      expect(mockToResponse).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await usersService.list();

      expect(result).toEqual([]);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await usersService.findByEmail('test@example.com');

      expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenUserException when user not found', async () => {
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        usersService.findByEmail('nonexistent@example.com'),
      ).rejects.toThrow(ForbiddenUserException);
    });
  });

  describe('findById', () => {
    it('should return user response when found by id', async () => {
      mockFindById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      mockToResponse.mockReturnValue(mockUserResponse);

      const result = await usersService.findById('user-id-123');

      expect(mockFindById).toHaveBeenCalledWith('user-id-123');
      expect(mockToResponse).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw ForbiddenUserException when user not found', async () => {
      mockFindById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(usersService.findById('nonexistent-id')).rejects.toThrow(
        ForbiddenUserException,
      );
    });
  });

  describe('remove', () => {
    it('should remove user when found', async () => {
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      mockDeleteOne.mockResolvedValue({ deletedCount: 1 });

      await usersService.remove('test@example.com');

      expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockDeleteOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should throw ForbiddenUserException when user not found', async () => {
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        usersService.remove('nonexistent@example.com'),
      ).rejects.toThrow(ForbiddenUserException);
    });
  });

  describe('changeName', () => {
    it('should update user name when different from current', async () => {
      const userWithSave = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true),
      };
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userWithSave),
      });

      await usersService.changeName('New Name', 'test@example.com');

      expect(userWithSave.name).toBe('New Name');
      expect(userWithSave.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when name is the same', async () => {
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(
        usersService.changeName('Test User', 'test@example.com'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePassword', () => {
    it('should update password when different from current', async () => {
      const userWithSave = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true),
      };
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userWithSave),
      });
      mockBcrypt.compare.mockResolvedValue(false);
      mockBcrypt.hash.mockResolvedValue('newHashedPassword');

      await usersService.changePassword('newPassword123', 'test@example.com');

      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        'newPassword123',
        mockUser.password,
      );
      expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(userWithSave.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when password is the same', async () => {
      mockFindOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      mockBcrypt.compare.mockResolvedValue(true);

      await expect(
        usersService.changePassword('samePassword', 'test@example.com'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});


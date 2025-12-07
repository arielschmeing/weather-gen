import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;

  const mockFindByEmail = jest.fn();
  const mockSign = jest.fn();

  const mockUser = {
    _id: 'user-id-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUsersService: Partial<UsersService> = {
      findByEmail: mockFindByEmail,
    };

    const mockJwtService: Partial<JwtService> = {
      sign: mockSign,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access_token when credentials are valid', async () => {
      const loginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedToken = 'jwt-token-123';

      mockFindByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockSign.mockReturnValue(expectedToken);

      const result = await authService.login(loginRequest);

      expect(mockFindByEmail).toHaveBeenCalledWith(loginRequest.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginRequest.password,
        mockUser.password,
      );
      expect(mockSign).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
      });
      expect(result).toEqual({ access_token: expectedToken });
    });

    it('should throw BadRequestException when password is incorrect', async () => {
      const loginRequest = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      mockFindByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginRequest)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockFindByEmail).toHaveBeenCalledWith(loginRequest.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginRequest.password,
        mockUser.password,
      );
      expect(mockSign).not.toHaveBeenCalled();
    });

    it('should propagate error when user is not found', async () => {
      const loginRequest = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockFindByEmail.mockRejectedValue(new Error('User not found'));

      await expect(authService.login(loginRequest)).rejects.toThrow(
        'User not found',
      );
      expect(mockSign).not.toHaveBeenCalled();
    });
  });
});



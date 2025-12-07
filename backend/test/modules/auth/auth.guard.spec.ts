import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const mockVerifyAsync = jest.fn();
  const mockGetAllAndOverride = jest.fn();
  const mockGetOrThrow = jest.fn().mockReturnValue('jwt-secret');

  const mockPayload = {
    sub: 'user-id-123',
    email: 'test@example.com',
  };

  const createMockExecutionContext = (
    authHeader?: string,
  ): ExecutionContext => {
    const mockRequest = {
      headers: {
        authorization: authHeader,
      },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const mockJwtService: Partial<JwtService> = {
      verifyAsync: mockVerifyAsync,
    };

    const mockReflector: Partial<Reflector> = {
      getAllAndOverride: mockGetAllAndOverride,
    };

    const mockConfigService: Partial<ConfigService> = {
      getOrThrow: mockGetOrThrow,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: Reflector, useValue: mockReflector },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true for public routes', async () => {
      mockGetAllAndOverride.mockReturnValue(true);
      const context = createMockExecutionContext();

      const result = await authGuard.canActivate(context);

      expect(result).toBe(true);
      expect(mockVerifyAsync).not.toHaveBeenCalled();
    });

    it('should return true when valid token is provided', async () => {
      mockGetAllAndOverride.mockReturnValue(false);
      mockVerifyAsync.mockResolvedValue(mockPayload);
      const context = createMockExecutionContext('Bearer valid-token');

      const result = await authGuard.canActivate(context);

      expect(result).toBe(true);
      expect(mockVerifyAsync).toHaveBeenCalledWith('valid-token', {
        secret: 'jwt-secret',
      });
    });

    it('should throw UnauthorizedException when no token is provided', async () => {
      mockGetAllAndOverride.mockReturnValue(false);
      const context = createMockExecutionContext();

      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockVerifyAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token format is invalid', async () => {
      mockGetAllAndOverride.mockReturnValue(false);
      const context = createMockExecutionContext('InvalidTokenFormat');

      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockVerifyAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token type is not Bearer', async () => {
      mockGetAllAndOverride.mockReturnValue(false);
      const context = createMockExecutionContext('Basic some-token');

      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockVerifyAsync).not.toHaveBeenCalled();
    });

    it('should set user payload on request when token is valid', async () => {
      mockGetAllAndOverride.mockReturnValue(false);
      mockVerifyAsync.mockResolvedValue(mockPayload);

      const mockRequest: Record<string, unknown> = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as unknown as ExecutionContext;

      await authGuard.canActivate(context);

      expect(mockRequest['user']).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException when token verification fails', async () => {
      mockGetAllAndOverride.mockReturnValue(false);
      mockVerifyAsync.mockRejectedValue(new Error('Invalid token'));
      const context = createMockExecutionContext('Bearer invalid-token');

      await expect(authGuard.canActivate(context)).rejects.toThrow();
    });
  });
});



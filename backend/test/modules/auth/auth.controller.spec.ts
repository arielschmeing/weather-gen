import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginRequest } from 'src/modules/auth/dto/login.request';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockLogin = jest.fn();

  beforeEach(async () => {
    const mockAuthService: Partial<AuthService> = {
      login: mockLogin,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access_token on successful login', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResponse = { access_token: 'jwt-token-123' };

      mockLogin.mockResolvedValue(expectedResponse);

      const result = await authController.login(loginRequest);

      expect(mockLogin).toHaveBeenCalledWith(loginRequest);
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate errors from AuthService', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      mockLogin.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.login(loginRequest)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockLogin).toHaveBeenCalledWith(loginRequest);
    });
  });
});



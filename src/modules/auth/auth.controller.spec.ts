import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthException } from './auth.exception';
import { BaseResponse } from '../../common/base-response';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user and return success response', async () => {
      const username = 'user1';
      const password = 'Password@123';
      const mockUser = { id: 1, username };

      jest.spyOn(mockService, 'register').mockResolvedValue(mockUser);

      const result = await controller.register({ username, password });

      expect(result).toEqual(
        BaseResponse.successResponse('User registered successfully', mockUser),
      );
      expect(service.register).toHaveBeenCalledWith(username, password);
    });

    it('should throw an AuthException if registration fails', async () => {
      const username = 'user1';
      const password = 'Password@123';

      jest
        .spyOn(mockService, 'register')
        .mockRejectedValue(new AuthException('Username is already taken', 400));

      await expect(controller.register({ username, password })).rejects.toThrow(
        AuthException,
      );
    });
  });

  describe('login', () => {
    it('should log in a user and return success response with token', async () => {
      const username = 'user1';
      const password = 'Password@123';
      const accessToken = 'mockedAccessToken';

      jest.spyOn(mockService, 'login').mockResolvedValue({ accessToken });

      const result = await controller.login({ username, password });

      expect(result).toEqual(
        BaseResponse.successResponse('User logged in successfully', {
          accessToken,
        }),
      );
      expect(service.login).toHaveBeenCalledWith(username, password);
    });

    it('should throw an AuthException if login fails', async () => {
      const username = 'user1';
      const password = 'InvalidPassword';

      jest
        .spyOn(mockService, 'login')
        .mockRejectedValue(
          new AuthException('Username or password is not valid', 401),
        );

      await expect(controller.login({ username, password })).rejects.toThrow(
        AuthException,
      );
    });
  });
});

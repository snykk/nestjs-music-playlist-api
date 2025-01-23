import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthException } from './auth.exception';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const username = 'user1';
      const password = 'Password@123';
      const hashedPassword: string = 'hashedPassword'; // Explicitly typed as string
      const newUser = { id: 1, username };

      mockPrisma.user.findUnique.mockResolvedValue(null); // No existing user

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      //   mockBcrypt.hash.mockResolvedValue(hashedPassword);

      mockPrisma.user.create.mockResolvedValue(newUser);

      const result = await service.register(username, password);

      expect(result).toEqual({ id: newUser.id, username: newUser.username });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: { username, passwordHash: hashedPassword },
      });
    });

    it('should throw AuthException if username already exists', async () => {
      const username = 'user1';
      const password = 'Password@123';

      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, username });

      await expect(service.register(username, password)).rejects.toThrow(
        new AuthException('Username is already taken', 400),
      );
    });

    it('should throw AuthException if any error occurs', async () => {
      const username = 'user1';
      const password = 'Password@123';

      mockPrisma.user.findUnique.mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(service.register(username, password)).rejects.toThrow(
        new AuthException('Error creating user', 500),
      );
    });
  });

  describe('login', () => {
    it('should log in successfully with valid credentials', async () => {
      const username = 'user1';
      const password = 'Password@123';
      const hashedPassword = 'hashedPassword';
      const accessToken = 'mockedAccessToken';
      const user = { id: 1, username, passwordHash: hashedPassword };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never); // Mock bcrypt.compare
      //   mockBcrypt.compare.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.login(username, password);

      expect(result).toEqual({ accessToken });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.passwordHash);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
      });
    });

    it('should throw AuthException if credentials are invalid', async () => {
      const username = 'user1';
      const password = 'InvalidPassword';
      const user = { id: 1, username, passwordHash: 'hashedPassword' };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never); // Password mismatch
      //   mockBcrypt.compare.mockResolvedValue(false);

      await expect(service.login(username, password)).rejects.toThrow(
        new AuthException('Username or password is not valid', 401),
      );
    });

    it('should throw AuthException if user is not found', async () => {
      const username = 'user1';
      const password = 'Password@123';

      mockPrisma.user.findUnique.mockResolvedValue(null); // User not found

      await expect(service.login(username, password)).rejects.toThrow(
        new AuthException('Username or password is not valid', 401),
      );
    });

    it('should throw AuthException if an unknown error occurs', async () => {
      const username = 'user1';
      const password = 'Password@123';

      mockPrisma.user.findUnique.mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(service.login(username, password)).rejects.toThrow(
        new AuthException('Error when loggin', 500),
      );
    });
  });
});

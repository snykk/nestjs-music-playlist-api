import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();
    await prisma.user.deleteMany(); // Clear users before starting tests
  });

  afterAll(async () => {
    await prisma.user.deleteMany(); // Clean up after tests
    await app.close();
  });

  describe('/api/auth/register (POST)', () => {
    it('should register a new user successfully', async () => {
      const regisRequest = {
        username: 'testregister',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(regisRequest)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.username).toBe('testregister');
    });

    it('should return error if username already exists', async () => {
      const regisRequest = {
        username: 'duplicateuser',
        password: 'password123',
      };

      // Register the user once
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(regisRequest)
        .expect(201);

      // Attempt to register again with the same username
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(regisRequest)
        .expect(400);

      expect(response.body.message).toBe('Username is already taken');
    });
  });

  describe('/api/auth/login (POST)', () => {
    beforeAll(async () => {
      const plaintextPassword = 'securepassword';
      const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

      // Ensure a user exists for login testing
      await prisma.user.create({
        data: {
          username: 'loginuser',
          passwordHash: hashedPassword, // Assume plaintext for testing simplicity
        },
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginRequest = {
        username: 'loginuser',
        password: 'securepassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginRequest)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('accessToken'); // Assuming login returns a token
    });

    it('should return error for invalid credentials', async () => {
      const loginRequest = {
        username: 'loginuser',
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginRequest)
        .expect(401);

      expect(response.body.message).toBe('Username or password is not valid');
    });
  });
});

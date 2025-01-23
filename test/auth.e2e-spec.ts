import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should register a new user', async () => {
    const registerDto = {
      username: 'testuser',
      password: 'password123',
    };
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(registerDto)
      .expect(201);

    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.data).toHaveProperty('username');
  });

  it('should login an existing user', async () => {
    const loginDto = {
      username: 'testuser',
      password: 'password123',
    };
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(loginDto)
      .expect(200);

    expect(response.body.message).toBe('User logged in successfully');
    expect(response.body.data).toHaveProperty('accessToken');
  });

  afterAll(async () => {
    await app.close();
  });
});

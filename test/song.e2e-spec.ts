import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('SongController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // First, login to get access token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',
      })
      .expect(200);

    accessToken = loginResponse.body.data.accessToken;
  });

  it('should create a new song', async () => {
    const songDto = { title: 'New Song', artist: 'Test Artist' };
    const response = await request(app.getHttpServer())
      .post('/api/songs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(songDto)
      .expect(201);

    expect(response.body.message).toBe('Song created successfully');
    expect(response.body.data).toHaveProperty('title');
  });

  it('should get all songs', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/songs')
      .expect(200);

    expect(response.body.message).toBe('Songs retrieved successfully');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should update an existing song', async () => {
    const songDto = { title: 'Updated Song', artist: 'Updated Artist' };
    const songId = 1; // assuming song with id 1 exists
    const response = await request(app.getHttpServer())
      .put(`/api/songs/${songId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(songDto)
      .expect(200);

    expect(response.body.message).toBe('Song updated successfully');
    expect(response.body.data.title).toBe('Updated Song');
  });

  it('should delete a song', async () => {
    const songId = 1; // assuming song with id 1 exists
    await request(app.getHttpServer())
      .delete(`/api/songs/${songId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});

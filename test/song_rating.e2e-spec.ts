import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('SongRatingController (e2e)', () => {
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

  it('should rate a song', async () => {
    const ratingDto = { rating: 5 };
    const songId = 1; // assuming song with id 1 exists
    const response = await request(app.getHttpServer())
      .put(`/api/songs/${songId}/rate`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(ratingDto)
      .expect(200);

    expect(response.body.message).toBe('Song rated successfully');
    expect(response.body.data.rating).toBe(5);
  });

  it('should get ratings for a song', async () => {
    const songId = 1; // assuming song with id 1 exists
    const response = await request(app.getHttpServer())
      .get(`/api/song_ratings/song/${songId}`)
      .expect(200);

    expect(response.body.message).toBe('Song ratings retrieved successfully');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});

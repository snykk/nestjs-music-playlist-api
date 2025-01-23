import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('PlaylistController (e2e)', () => {
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

  it('should create a new playlist', async () => {
    const playlistDto = { name: 'New Playlist', genre: 'Pop' };
    const response = await request(app.getHttpServer())
      .post('/api/playlists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(playlistDto)
      .expect(201);

    expect(response.body.message).toBe('Playlist created successfully');
    expect(response.body.data).toHaveProperty('name');
  });

  it('should add song to playlist', async () => {
    const songDto = { songId: 1 }; // assuming song with id 1 exists
    const playlistId = 1; // assuming playlist with id 1 exists
    const response = await request(app.getHttpServer())
      .post(`/api/playlists/${playlistId}/songs`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(songDto)
      .expect(200);

    expect(response.body.message).toBe('Song added to playlist successfully');
    expect(response.body.data).toHaveProperty('songId');
  });

  afterAll(async () => {
    await app.close();
  });
});

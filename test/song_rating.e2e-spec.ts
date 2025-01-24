import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('SongRatingController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let authToken: string;
  let userId: number;
  let songId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);

    await app.init();

    // Clean up the database
    await prisma.songRating.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();

    const plaintextPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

    // Create a test user and generate JWT token
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        passwordHash: hashedPassword,
      },
    });

    const song = await prisma.song.create({
      data: {
        title: 'Test Song',
        artist: 'Test Artist',
        filePath: 'test.mp3',
      },
    });

    const payload = { sub: user.id, username: user.username };
    authToken = jwtService.sign(payload);
    userId = user.id;
    songId = song.id;
  });

  afterAll(async () => {
    // Clean up after tests
    await prisma.songRating.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/api/song_ratings/user/:userId (GET)', () => {
    it('should retrieve ratings for a specific user', async () => {
      const rating = await prisma.songRating.create({
        data: {
          userId,
          songId,
          rating: 5,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/song_ratings/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'User song ratings retrieved successfully',
      );
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('id', rating.id);
    });
  });

  describe('/api/song_ratings/song/:songId (GET)', () => {
    it('should retrieve ratings for a specific song', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/song_ratings/song/${songId}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Song ratings retrieved successfully',
      );
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('songId', songId);
    });
  });

  describe('/api/song_ratings/user/:userId/song/:songId (GET)', () => {
    it('should retrieve a specific rating for a user and song', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/song_ratings/user/${userId}/song/${songId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'User and song rating retrieved successfully',
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('userId', userId);
      expect(response.body.data).toHaveProperty('songId', songId);
    });

    it('should return 404 if no rating exists for the user and song', async () => {
      const invalidUserId = 9999;
      const invalidSongId = 9999;

      const response = await request(app.getHttpServer())
        .get(`/api/song_ratings/user/${invalidUserId}/song/${invalidSongId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/No rating found for user ID/);
    });
  });

  describe('/api/song_ratings (GET)', () => {
    it('should retrieve all ratings successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/song_ratings')
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'All song ratings retrieved successfully',
      );
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});

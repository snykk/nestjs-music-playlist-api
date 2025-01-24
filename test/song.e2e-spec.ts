// e2e/song.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('SongController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let authToken: string;
  let userId: number;

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

    const payload = { sub: user.id, username: user.username };
    authToken = jwtService.sign(payload);
    userId = user.id;
  });

  afterAll(async () => {
    // Clean up after tests
    await prisma.songRating.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/api/songs (POST)', () => {
    it('should create a new song successfully', async () => {
      const songRequest = {
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        filePath: 'test.mp3',
      };

      const response = await request(app.getHttpServer())
        .post('/api/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(songRequest)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.title).toBe(songRequest.title);
      expect(response.body.data.artist).toBe(songRequest.artist);
      expect(response.body.data.album).toBe(songRequest.album);
    });
  });

  describe('/api/songs (GET)', () => {
    it('should retrieve all songs successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/songs')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('/api/songs/:id (GET)', () => {
    let songId: number;

    beforeAll(async () => {
      const song = await prisma.song.create({
        data: {
          title: 'Another Test Song',
          artist: 'Another Test Artist',
          filePath: 'test2.mp3',
        },
      });
      songId = song.id;
    });

    it('should retrieve a specific song by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/songs/${songId}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(songId);
      expect(response.body.data.title).toBe('Another Test Song');
    });
  });

  describe('/api/songs/:id (PUT)', () => {
    let songId: number;

    beforeAll(async () => {
      const song = await prisma.song.create({
        data: {
          title: 'Song To Update',
          artist: 'Artist To Update',
          filePath: 'update.mp3',
        },
      });
      songId = song.id;
    });

    it('should update a song successfully', async () => {
      const updatedRequest = {
        title: 'Updated Song',
        artist: 'Updated Artist',
        filePath: 'updated.mp3',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/songs/${songId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedRequest)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.title).toBe(updatedRequest.title);
      expect(response.body.data.artist).toBe(updatedRequest.artist);
    });
  });

  describe('/api/songs/:id (DELETE)', () => {
    let songId: number;

    beforeAll(async () => {
      const song = await prisma.song.create({
        data: {
          title: 'Song To Delete',
          artist: 'Artist To Delete',
          filePath: 'delete.mp3',
        },
      });
      songId = song.id;
    });

    it('should delete a song successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/api/songs/${songId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      const deletedSong = await prisma.song.findUnique({
        where: { id: songId },
      });
      expect(deletedSong).toBeNull();
    });
  });

  describe('/api/songs/:songId/rate (PUT)', () => {
    let songId: number;

    beforeAll(async () => {
      const song = await prisma.song.create({
        data: {
          title: 'Song To Rate',
          artist: 'Artist To Rate',
          filePath: 'rate.mp3',
        },
      });
      songId = song.id;
    });

    it('should rate a song successfully', async () => {
      const ratingRequest = { rating: 5 };

      const response = await request(app.getHttpServer())
        .put(`/api/songs/${songId}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(ratingRequest)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.songId).toBe(songId);
      expect(response.body.data.rating).toBe(ratingRequest.rating);
    });
  });
});

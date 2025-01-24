// e2e/playlist.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('PlaylistController (e2e)', () => {
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
    await prisma.playlistSong.deleteMany();
    await prisma.playlist.deleteMany();
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
    await prisma.playlistSong.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/api/playlists (POST)', () => {
    it('should create a new playlist successfully', async () => {
      const playlistRequest = {
        name: 'My Playlist',
        genre: 'Pop',
      };

      const response = await request(app.getHttpServer())
        .post('/api/playlists')
        .set('Authorization', `Bearer ${authToken}`)
        .send(playlistRequest)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('My Playlist');
      expect(response.body.data.genre).toBe('Pop');
      expect(response.body.data.userId).toBe(userId);
    });
  });

  describe('/api/playlists (GET)', () => {
    it('should retrieve user playlists successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/playlists')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('/api/playlists/:id/songs (POST)', () => {
    let playlistId: number;
    let songId: number;

    beforeAll(async () => {
      const playlist = await prisma.playlist.create({
        data: {
          name: 'Playlist with Songs',
          genre: 'Pop',
          userId: userId,
        },
      });
      playlistId = playlist.id;

      const song = await prisma.song.create({
        data: {
          title: 'Test Song',
          artist: 'Test Artist',
          filePath: 'test.mp3',
        },
      });
      songId = song.id;
    });

    it('should add a song to a playlist successfully', async () => {
      const songRequest = { songId };

      const response = await request(app.getHttpServer())
        .post(`/api/playlists/${playlistId}/songs`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(songRequest)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.playlistId).toBe(playlistId);
      expect(response.body.data.songId).toBe(songId);
    });
  });

  describe('/api/playlists/:id/songs/:songId (DELETE)', () => {
    let playlistId: number;
    let songId: number;

    beforeAll(async () => {
      const playlist = await prisma.playlist.create({
        data: {
          name: 'Playlist for Deletion',
          genre: 'Pop',
          userId: userId,
        },
      });

      playlistId = playlist.id;
      const song = await prisma.song.create({
        data: {
          title: 'Test Song',
          artist: 'Test Artist',
          filePath: 'test.mp3',
        },
      });

      songId = song.id;

      await prisma.playlistSong.create({
        data: {
          playlistId,
          songId,
        },
      });
    });

    it('should remove a song from a playlist successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/api/playlists/${playlistId}/songs/${songId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      const songInPlaylist = await prisma.playlistSong.findFirst({
        where: {
          playlistId,
          songId,
        },
      });

      expect(songInPlaylist).toBeNull();
    });
  });

  describe('/api/playlists/search (GET)', () => {
    beforeAll(async () => {
      await prisma.playlist.create({
        data: {
          name: 'Search Playlist',
          genre: 'Rock',
          userId: userId,
        },
      });
    });

    it('should search playlists by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/playlists/search?name=Search')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should search playlists by genre', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/playlists/search?genre=Rock')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});

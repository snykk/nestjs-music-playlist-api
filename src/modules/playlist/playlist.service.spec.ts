import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistService } from './playlist.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PlaylistException } from './playlist.exception';
import { HttpStatus } from '@nestjs/common';

describe('PlaylistService', () => {
  let service: PlaylistService;
  let prisma: PrismaService;

  const mockPrisma = {
    playlist: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    playlistSong: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    song: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PlaylistService>(PlaylistService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createPlaylist', () => {
    it('should create a playlist successfully', async () => {
      const userId = 1;
      const request = { name: 'Rock Hits', genre: 'Rock' };
      const response = { id: 1, name: 'Rock Hits', genre: 'Rock', userId };

      mockPrisma.playlist.create.mockResolvedValue(response);

      const result = await service.createPlaylist(userId, request);

      expect(result).toEqual(response);
      expect(mockPrisma.playlist.create).toHaveBeenCalledWith({
        data: { userId, ...request },
      });
    });

    it('should throw an exception if creation fails', async () => {
      const userId = 1;
      const request = { name: 'Rock Hits', genre: 'Rock' };

      mockPrisma.playlist.create.mockRejectedValue(new Error());

      await expect(service.createPlaylist(userId, request)).rejects.toThrow(
        PlaylistException,
      );
    });
  });

  describe('getUserPlaylists', () => {
    it('should retrieve playlists for a user successfully', async () => {
      const userId = 1;
      const response = [
        { id: 1, name: 'Rock Hits', genre: 'Rock', userId, songs: [] },
      ];

      mockPrisma.playlist.findMany.mockResolvedValue(response);

      const result = await service.getUserPlaylists(userId);

      expect(result).toEqual(response);
      expect(mockPrisma.playlist.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { songs: true },
      });
    });

    it('should throw an exception if no playlists found', async () => {
      const userId = 1;

      mockPrisma.playlist.findMany.mockResolvedValue([]);

      await expect(service.getUserPlaylists(userId)).rejects.toThrowError(
        new PlaylistException('No playlists found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if fetching fails', async () => {
      const userId = 1;

      mockPrisma.playlist.findMany.mockRejectedValue(new Error());

      await expect(service.getUserPlaylists(userId)).rejects.toThrow(
        PlaylistException,
      );
    });
  });

  describe('addSongToPlaylist', () => {
    it('should add a song to a playlist successfully', async () => {
      const playlistId = 1;
      const songId = 2;
      const response = { id: 1, playlistId, songId };

      mockPrisma.song.findUnique.mockResolvedValue({ id: songId });
      mockPrisma.playlistSong.create.mockResolvedValue(response);

      const result = await service.addSongToPlaylist(playlistId, songId);

      expect(result).toEqual(response);
      expect(mockPrisma.song.findUnique).toHaveBeenCalledWith({
        where: { id: songId },
      });
      expect(mockPrisma.playlistSong.create).toHaveBeenCalledWith({
        data: { playlistId, songId },
      });
    });

    it('should throw an exception if song does not exist', async () => {
      const playlistId = 1;
      const songId = 2;

      mockPrisma.song.findUnique.mockResolvedValue(null);

      await expect(
        service.addSongToPlaylist(playlistId, songId),
      ).rejects.toThrowError(
        new PlaylistException('Song not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if addition fails', async () => {
      const playlistId = 1;
      const songId = 2;

      mockPrisma.song.findUnique.mockResolvedValue({ id: songId });
      mockPrisma.playlistSong.create.mockRejectedValue(new Error());

      await expect(
        service.addSongToPlaylist(playlistId, songId),
      ).rejects.toThrow(PlaylistException);
    });
  });

  describe('removeSongFromPlaylist', () => {
    it('should remove a song from a playlist successfully', async () => {
      const playlistId = 1;
      const songId = 2;

      mockPrisma.song.findUnique.mockResolvedValue({ id: songId });
      mockPrisma.playlistSong.deleteMany.mockResolvedValue(undefined);

      const result = await service.removeSongFromPlaylist(playlistId, songId);

      expect(result).toBeUndefined();
      expect(mockPrisma.song.findUnique).toHaveBeenCalledWith({
        where: { id: songId },
      });
      expect(mockPrisma.playlistSong.deleteMany).toHaveBeenCalledWith({
        where: { playlistId, songId },
      });
    });

    it('should throw an exception if song does not exist', async () => {
      const playlistId = 1;
      const songId = 2;

      mockPrisma.song.findUnique.mockResolvedValue(null);

      await expect(
        service.removeSongFromPlaylist(playlistId, songId),
      ).rejects.toThrowError(
        new PlaylistException('Song not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if removal fails', async () => {
      const playlistId = 1;
      const songId = 2;

      mockPrisma.song.findUnique.mockResolvedValue({ id: songId });
      mockPrisma.playlistSong.deleteMany.mockRejectedValue(new Error());

      await expect(
        service.removeSongFromPlaylist(playlistId, songId),
      ).rejects.toThrow(PlaylistException);
    });
  });

  describe('searchPlaylists', () => {
    it('should search playlists by name or genre successfully', async () => {
      const name = 'Rock';
      const genre = 'Pop';
      const response = [
        { id: 1, name: 'Rock Hits', genre: 'Rock', userId: 1 },
        { id: 2, name: 'Pop Hits', genre: 'Pop', userId: 1 },
      ];

      mockPrisma.playlist.findMany.mockResolvedValue(response);

      const result = await service.searchPlaylists(name, genre);

      expect(result).toEqual(response);
      expect(mockPrisma.playlist.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: name, mode: 'insensitive' },
          genre: { contains: genre, mode: 'insensitive' },
        },
      });
    });

    it('should throw an exception if no playlists found', async () => {
      const name = 'Rock';
      const genre = 'Pop';

      mockPrisma.playlist.findMany.mockResolvedValue([]);

      await expect(service.searchPlaylists(name, genre)).rejects.toThrowError(
        new PlaylistException('No playlists found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if search fails', async () => {
      const name = 'Rock';
      const genre = 'Pop';

      mockPrisma.playlist.findMany.mockRejectedValue(new Error());

      await expect(service.searchPlaylists(name, genre)).rejects.toThrow(
        PlaylistException,
      );
    });
  });
});

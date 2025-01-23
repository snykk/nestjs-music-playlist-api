import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from './song.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SongRequest, SongResponse, RatingRequest } from './song.dto';
import { SongException } from './song.exception';

describe('SongService', () => {
  let service: SongService;
  let prisma: PrismaService;

  const mockPrisma = {
    song: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    songRating: {
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<SongService>(SongService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createSong', () => {
    it('should create a song', async () => {
      const request: SongRequest = {
        title: 'Test',
        artist: 'Artist',
        album: 'Album',
        filePath: '/path',
      };
      const response: SongResponse = { id: 1, ...request };

      mockPrisma.song.create.mockResolvedValue(response);

      const result = await service.createSong(request);

      expect(result).toEqual(response);
      expect(mockPrisma.song.create).toHaveBeenCalledWith({ data: request });
    });

    it('should throw an exception when creation fails', async () => {
      mockPrisma.song.create.mockRejectedValue(new Error());

      await expect(
        service.createSong({
          title: 'Test',
          artist: 'Artist',
          album: 'Album',
          filePath: '/path',
        }),
      ).rejects.toThrow(SongException);
    });
  });

  describe('getAllSongs', () => {
    it('should retrieve all songs', async () => {
      const songs: SongResponse[] = [
        {
          id: 1,
          title: 'Test',
          artist: 'Artist',
          album: 'Album',
          filePath: '/path',
        },
      ];

      mockPrisma.song.findMany.mockResolvedValue(songs);

      const result = await service.getAllSongs();

      expect(result).toEqual(songs);
      expect(mockPrisma.song.findMany).toHaveBeenCalled();
    });

    it('should throw an exception when no songs are found', async () => {
      mockPrisma.song.findMany.mockResolvedValue([]);

      await expect(service.getAllSongs()).rejects.toThrow(SongException);
    });
  });

  describe('getSongById', () => {
    it('should retrieve a song by ID', async () => {
      const mockSong: SongResponse = {
        id: 1,
        title: 'Test',
        artist: 'Artist',
        album: 'Album',
        filePath: '/path',
      };

      mockPrisma.song.findUnique.mockResolvedValue(mockSong);

      const result = await service.getSongById(1);

      expect(result).toEqual(mockSong);
      expect(mockPrisma.song.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw an exception if song is not found', async () => {
      mockPrisma.song.findUnique.mockResolvedValue(null);

      await expect(service.getSongById(1)).rejects.toThrow(SongException);
    });
  });

  describe('updateSong', () => {
    it('should update a song', async () => {
      const request: SongRequest = {
        title: 'Updated',
        artist: 'Updated Artist',
        album: 'Updated Album',
        filePath: '/updated/path',
      };
      const updatedSong: SongResponse = { id: 1, ...request };

      mockPrisma.song.update.mockResolvedValue(updatedSong);

      const result = await service.updateSong(1, request);

      expect(result).toEqual(updatedSong);
      expect(mockPrisma.song.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: request,
      });
    });

    it('should throw an exception if update fails', async () => {
      mockPrisma.song.update.mockRejectedValue(new Error());

      await expect(
        service.updateSong(1, {
          title: 'Test',
          artist: 'Artist',
          album: 'Album',
          filePath: '/path',
        }),
      ).rejects.toThrow(SongException);
    });
  });

  describe('deleteSong', () => {
    it('should delete a song', async () => {
      mockPrisma.song.delete.mockResolvedValue(undefined);

      const result = await service.deleteSong(1);

      expect(result).toBeUndefined();
      expect(mockPrisma.song.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an exception if deletion fails', async () => {
      mockPrisma.song.delete.mockRejectedValue(new Error());

      await expect(service.deleteSong(1)).rejects.toThrow(SongException);
    });
  });

  describe('rateSong', () => {
    it('should rate a song', async () => {
      const ratingRequest: RatingRequest = { rating: 5 };
      const mockRatingResponse = { userId: 1, songId: 1, rating: 5 };

      mockPrisma.songRating.upsert.mockResolvedValue(mockRatingResponse);

      const result = await service.rateSong(1, 1, ratingRequest);

      expect(result).toEqual(mockRatingResponse);
      expect(mockPrisma.songRating.upsert).toHaveBeenCalledWith({
        where: { userId_songId: { userId: 1, songId: 1 } },
        update: { rating: 5 },
        create: { userId: 1, songId: 1, rating: 5 },
      });
    });

    it('should throw an exception if rating fails', async () => {
      mockPrisma.songRating.upsert.mockRejectedValue(new Error());

      await expect(service.rateSong(1, 1, { rating: 4 })).rejects.toThrow(
        SongException,
      );
    });
  });
});

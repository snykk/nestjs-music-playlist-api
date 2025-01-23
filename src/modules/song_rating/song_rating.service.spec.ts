import { Test, TestingModule } from '@nestjs/testing';
import { SongRatingService } from './song_rating.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SongRatingExceptions } from './song_rating.exception';

describe('SongRatingService', () => {
  let service: SongRatingService;
  let prisma: PrismaService;

  const mockPrisma = {
    songRating: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongRatingService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<SongRatingService>(SongRatingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAllRatings', () => {
    it('should return all song ratings', async () => {
      const ratings = [
        {
          id: 1,
          userId: 1,
          songId: 1,
          rating: 5,
          user: { id: 1, username: 'User1' },
          song: { id: 1, title: 'Song1' },
        },
      ];

      mockPrisma.songRating.findMany.mockResolvedValue(ratings);

      const result = await service.getAllRatings();

      expect(result).toEqual(ratings);
      expect(mockPrisma.songRating.findMany).toHaveBeenCalled();
    });

    it('should throw an exception when no ratings are found', async () => {
      mockPrisma.songRating.findMany.mockResolvedValue([]);

      await expect(service.getAllRatings()).rejects.toThrow(
        SongRatingExceptions,
      );
    });
  });

  describe('getRatingsByUser', () => {
    it('should return ratings for a specific user', async () => {
      const userId = 1;
      const ratings = [
        {
          id: 1,
          userId: 1,
          songId: 1,
          rating: 4,
          song: { id: 1, title: 'Song1', artist: 'Artist1' },
        },
      ];

      mockPrisma.songRating.findMany.mockResolvedValue(ratings);

      const result = await service.getRatingsByUser(userId);

      expect(result).toEqual(ratings);
      expect(mockPrisma.songRating.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { song: { select: { id: true, title: true, artist: true } } },
      });
    });

    it('should throw an exception when no ratings are found for the user', async () => {
      const userId = 1;
      mockPrisma.songRating.findMany.mockResolvedValue([]);

      await expect(service.getRatingsByUser(userId)).rejects.toThrow(
        SongRatingExceptions,
      );
    });
  });

  describe('getRatingsBySong', () => {
    it('should return ratings for a specific song', async () => {
      const songId = 1;
      const ratings = [
        {
          id: 1,
          userId: 1,
          songId: 1,
          rating: 4,
          user: { id: 1, username: 'User1' },
        },
      ];

      mockPrisma.songRating.findMany.mockResolvedValue(ratings);

      const result = await service.getRatingsBySong(songId);

      expect(result).toEqual(ratings);
      expect(mockPrisma.songRating.findMany).toHaveBeenCalledWith({
        where: { songId },
        include: { user: { select: { id: true, username: true } } },
      });
    });

    it('should throw an exception when no ratings are found for the song', async () => {
      const songId = 1;
      mockPrisma.songRating.findMany.mockResolvedValue([]);

      await expect(service.getRatingsBySong(songId)).rejects.toThrow(
        SongRatingExceptions,
      );
    });
  });

  describe('getRatingByUserAndSong', () => {
    it('should return a specific rating for a user and song', async () => {
      const userId = 1;
      const songId = 1;
      const rating = {
        id: 1,
        userId: 1,
        songId: 1,
        rating: 5,
        user: { id: 1, username: 'User1' },
        song: { id: 1, title: 'Song1', artist: 'Artist1' },
      };

      mockPrisma.songRating.findUnique.mockResolvedValue(rating);

      const result = await service.getRatingByUserAndSong(userId, songId);

      expect(result).toEqual(rating);
      expect(mockPrisma.songRating.findUnique).toHaveBeenCalledWith({
        where: { userId_songId: { userId, songId } },
        include: {
          user: { select: { id: true, username: true } },
          song: { select: { id: true, title: true, artist: true } },
        },
      });
    });

    it('should throw an exception when no rating is found for the user and song', async () => {
      const userId = 1;
      const songId = 1;

      mockPrisma.songRating.findUnique.mockResolvedValue(null);

      await expect(
        service.getRatingByUserAndSong(userId, songId),
      ).rejects.toThrow(SongRatingExceptions);
    });
  });
});

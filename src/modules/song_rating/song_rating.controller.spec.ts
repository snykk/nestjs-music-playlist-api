import { Test, TestingModule } from '@nestjs/testing';
import { SongRatingController } from './song_rating.controller';
import { SongRatingService } from './song_rating.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SongRatingResponse } from './song_rating.dto';
import { SongRatingExceptions } from './song_rating.exception';
import { BaseResponse } from '../../common/base-response';

describe('SongRatingController', () => {
  let controller: SongRatingController;
  let service: SongRatingService;

  const mockService = {
    getAllRatings: jest.fn(),
    getRatingsByUser: jest.fn(),
    getRatingsBySong: jest.fn(),
    getRatingByUserAndSong: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongRatingController],
      providers: [
        {
          provide: SongRatingService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SongRatingController>(SongRatingController);
    service = module.get<SongRatingService>(SongRatingService);
  });

  describe('getAllRatings', () => {
    it('should return all song ratings', async () => {
      const ratings: SongRatingResponse[] = [
        { id: 1, userId: 1, songId: 1, rating: 5 },
      ];
      jest.spyOn(service, 'getAllRatings').mockResolvedValue(ratings);

      const result = await controller.getAllRatings();

      expect(result).toEqual(
        BaseResponse.successResponse(
          'All song ratings retrieved successfully',
          ratings,
        ),
      );
      expect(service.getAllRatings).toHaveBeenCalled();
    });

    it('should throw an exception if service fails', async () => {
      jest
        .spyOn(service, 'getAllRatings')
        .mockRejectedValue(new SongRatingExceptions('No ratings found', 404));

      await expect(controller.getAllRatings()).rejects.toThrow(
        SongRatingExceptions,
      );
    });
  });

  describe('getRatingsByUser', () => {
    it('should return ratings for a specific user', async () => {
      const userId = '1';
      const ratings: SongRatingResponse[] = [
        { id: 1, userId: 1, songId: 1, rating: 4 },
      ];

      jest.spyOn(service, 'getRatingsByUser').mockResolvedValue(ratings);

      const result = await controller.getRatingsByUser(userId);

      expect(result).toEqual(
        BaseResponse.successResponse(
          'User song ratings retrieved successfully',
          ratings,
        ),
      );
      expect(service.getRatingsByUser).toHaveBeenCalledWith(Number(userId));
    });

    it('should throw an exception if service fails', async () => {
      const userId = '1';

      jest
        .spyOn(service, 'getRatingsByUser')
        .mockRejectedValue(
          new SongRatingExceptions('No ratings found for user', 404),
        );

      await expect(controller.getRatingsByUser(userId)).rejects.toThrow(
        SongRatingExceptions,
      );
    });
  });

  describe('getRatingsBySong', () => {
    it('should return ratings for a specific song', async () => {
      const songId = '1';
      const ratings: SongRatingResponse[] = [
        { id: 1, userId: 1, songId: 1, rating: 4 },
      ];

      jest.spyOn(mockService, 'getRatingsBySong').mockResolvedValue(ratings);

      const result = await controller.getRatingsBySong(songId);

      expect(result).toEqual(
        BaseResponse.successResponse(
          'Song ratings retrieved successfully',
          ratings,
        ),
      );
      expect(service.getRatingsBySong).toHaveBeenCalledWith(Number(songId));
    });

    it('should throw an exception if service fails', async () => {
      const songId = '1';

      jest
        .spyOn(service, 'getRatingsBySong')
        .mockRejectedValue(
          new SongRatingExceptions('No ratings found for song', 404),
        );

      await expect(controller.getRatingsBySong(songId)).rejects.toThrow(
        SongRatingExceptions,
      );
    });
  });

  describe('getRatingByUserAndSong', () => {
    it('should return a specific rating for a user and song', async () => {
      const userId = '1';
      const songId = '1';
      const rating: SongRatingResponse = {
        id: 1,
        userId: 1,
        songId: 1,
        rating: 5,
      };

      jest
        .spyOn(mockService, 'getRatingByUserAndSong')
        .mockResolvedValue(rating);

      const result = await controller.getRatingByUserAndSong(userId, songId);

      expect(result).toEqual(
        BaseResponse.successResponse(
          'User and song rating retrieved successfully',
          rating,
        ),
      );
      expect(service.getRatingByUserAndSong).toHaveBeenCalledWith(
        Number(userId),
        Number(songId),
      );
    });

    it('should throw an exception if service fails', async () => {
      const userId = '1';
      const songId = '1';

      jest
        .spyOn(service, 'getRatingByUserAndSong')
        .mockRejectedValue(new SongRatingExceptions('No rating found', 404));

      await expect(
        controller.getRatingByUserAndSong(userId, songId),
      ).rejects.toThrow(SongRatingExceptions);
    });
  });
});

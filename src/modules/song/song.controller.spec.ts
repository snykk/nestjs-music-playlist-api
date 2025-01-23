import { Test, TestingModule } from '@nestjs/testing';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SongRequest, RatingRequest } from './song.dto';
import { HttpException } from '@nestjs/common';
import { BaseResponse } from '../../common/base-response';

describe('SongController', () => {
  let controller: SongController;
  let service: SongService;

  const mockSongService = {
    createSong: jest.fn(),
    getAllSongs: jest.fn(),
    getSongById: jest.fn(),
    updateSong: jest.fn(),
    deleteSong: jest.fn(),
    rateSong: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongController],
      providers: [
        {
          provide: SongService,
          useValue: mockSongService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SongController>(SongController);
    service = module.get<SongService>(SongService);
  });

  describe('createSong', () => {
    it('should create a song and return a success response', async () => {
      const songRequest: SongRequest = {
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        filePath: '/path/to/test',
      };
      const mockResponse = { id: 1, ...songRequest };

      jest.spyOn(service, 'createSong').mockResolvedValue(mockResponse);

      const result = await controller.createSong(songRequest);

      expect(result).toEqual(
        BaseResponse.successResponse('Song created successfully', mockResponse),
      );
      expect(service.createSong).toHaveBeenCalledWith(songRequest);
    });

    it('should throw an HttpException on failure', async () => {
      const songRequest: SongRequest = {
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        filePath: '/path/to/test',
      };

      jest.spyOn(service, 'createSong').mockRejectedValue(new Error());

      await expect(controller.createSong(songRequest)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getAllSongs', () => {
    it('should retrieve all songs and return a success response', async () => {
      const mockSongs = [
        {
          id: 1,
          title: 'Song 1',
          artist: 'Artist 1',
          album: 'Album 1',
          filePath: '/path1',
        },
        {
          id: 2,
          title: 'Song 2',
          artist: 'Artist 2',
          album: 'Album 2',
          filePath: '/path2',
        },
      ];

      jest.spyOn(service, 'getAllSongs').mockResolvedValue(mockSongs);

      const result = await controller.getAllSongs();

      expect(result).toEqual(
        BaseResponse.successResponse('Songs retrieved successfully', mockSongs),
      );
      expect(service.getAllSongs).toHaveBeenCalled();
    });

    it('should throw an HttpException on failure', async () => {
      jest.spyOn(service, 'getAllSongs').mockRejectedValue(new Error());

      await expect(controller.getAllSongs()).rejects.toThrow(HttpException);
    });
  });

  describe('getSong', () => {
    it('should retrieve a song by ID and return a success response', async () => {
      const mockSong = {
        id: 1,
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        filePath: '/path/to/test',
      };

      jest.spyOn(service, 'getSongById').mockResolvedValue(mockSong);

      const result = await controller.getSong('1');

      expect(result).toEqual(
        BaseResponse.successResponse('Song retrieved successfully', mockSong),
      );
      expect(service.getSongById).toHaveBeenCalledWith(1);
    });

    it('should throw an HttpException on failure', async () => {
      jest.spyOn(service, 'getSongById').mockRejectedValue(new Error());

      await expect(controller.getSong('1')).rejects.toThrow(HttpException);
    });
  });

  describe('updateSong', () => {
    it('should update a song and return a success response', async () => {
      const songRequest: SongRequest = {
        title: 'Updated Song',
        artist: 'Updated Artist',
        album: 'Updated Album',
        filePath: '/path/to/updated',
      };

      const updatedSong = { id: 1, ...songRequest };

      jest.spyOn(service, 'updateSong').mockResolvedValue(updatedSong);

      const result = await controller.updateSong('1', songRequest);

      expect(result).toEqual(
        BaseResponse.successResponse('Song updated successfully', updatedSong),
      );
      expect(service.updateSong).toHaveBeenCalledWith(1, songRequest);
    });

    it('should throw an HttpException on failure', async () => {
      jest.spyOn(service, 'updateSong').mockRejectedValue(new Error());

      await expect(
        controller.updateSong('1', {
          title: 'Test',
          artist: 'Test Artist',
          album: 'Test Album',
          filePath: '/test/path',
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteSong', () => {
    it('should delete a song and return a success response', async () => {
      jest.spyOn(service, 'deleteSong').mockResolvedValue(undefined);

      const result = await controller.deleteSong('1');

      expect(result).toBeUndefined();
      expect(service.deleteSong).toHaveBeenCalledWith(1);
    });

    it('should throw an HttpException on failure', async () => {
      jest.spyOn(service, 'deleteSong').mockRejectedValue(new Error());

      await expect(controller.deleteSong('1')).rejects.toThrow(HttpException);
    });
  });

  describe('rateSong', () => {
    it('should rate a song and return a success response', async () => {
      const ratingRequest: RatingRequest = { rating: 5 };
      const mockRatingResponse = { id: 1, userId: 1, songId: 1, rating: 5 };

      jest.spyOn(service, 'rateSong').mockResolvedValue(mockRatingResponse);

      const mockReq = { user: { userId: 1 } };

      const result = await controller.rateSong(mockReq, '1', ratingRequest);

      expect(result).toEqual(
        BaseResponse.successResponse(
          'Song rated successfully',
          mockRatingResponse,
        ),
      );
      expect(service.rateSong).toHaveBeenCalledWith(1, 1, ratingRequest);
    });

    it('should throw an HttpException on failure', async () => {
      jest.spyOn(service, 'rateSong').mockRejectedValue(new Error());

      const mockReq = { user: { userId: 1 } };

      await expect(
        controller.rateSong(mockReq, '1', { rating: 4 }),
      ).rejects.toThrow(HttpException);
    });
  });
});

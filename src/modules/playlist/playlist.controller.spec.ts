import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaylistException } from './playlist.exception';
import { BaseResponse } from '../../common/base-response';
import {
  PlaylistRequest,
  AddSongToPlaylistRequest,
  PlaylistResponse,
  PlaylistSongResponse,
} from './playlist.dto';

describe('PlaylistController', () => {
  let controller: PlaylistController;
  let service: PlaylistService;

  const mockService = {
    createPlaylist: jest.fn(),
    getUserPlaylists: jest.fn(),
    addSongToPlaylist: jest.fn(),
    removeSongFromPlaylist: jest.fn(),
    searchPlaylists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistController],
      providers: [
        {
          provide: PlaylistService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PlaylistController>(PlaylistController);
    service = module.get<PlaylistService>(PlaylistService);
  });

  describe('createPlaylist', () => {
    it('should create a playlist successfully', async () => {
      const userId = 1;
      const request: PlaylistRequest = { name: 'Rock Hits', genre: 'Rock' };
      const response: PlaylistResponse = {
        id: 1,
        name: 'Rock Hits',
        genre: 'Rock',
        userId,
      };

      jest.spyOn(service, 'createPlaylist').mockResolvedValue(response);

      const result = await controller.createPlaylist(
        { user: { userId } },
        request,
      );

      expect(result).toEqual(
        BaseResponse.successResponse('Playlist created successfully', response),
      );
      expect(service.createPlaylist).toHaveBeenCalledWith(userId, request);
    });

    it('should throw an exception if service fails', async () => {
      const userId = 1;
      const request: PlaylistRequest = { name: 'Rock Hits', genre: 'Rock' };

      mockService.createPlaylist.mockRejectedValue(
        new PlaylistException('Error', 500),
      );

      await expect(
        controller.createPlaylist({ user: { userId } }, request),
      ).rejects.toThrow(PlaylistException);
    });
  });

  describe('getUserPlaylists', () => {
    it('should retrieve user playlists successfully', async () => {
      const userId = 1;
      const playlists: PlaylistResponse[] = [
        { id: 1, name: 'Rock Hits', genre: 'Rock', userId },
      ];

      jest.spyOn(service, 'getUserPlaylists').mockResolvedValue(playlists);

      const result = await controller.getUserPlaylists({ user: { userId } });

      expect(result).toEqual(
        BaseResponse.successResponse(
          'User playlists retrieved successfully',
          playlists,
        ),
      );
      expect(service.getUserPlaylists).toHaveBeenCalledWith(userId);
    });

    it('should throw an exception if service fails', async () => {
      const userId = 1;

      mockService.getUserPlaylists.mockRejectedValue(
        new PlaylistException('No playlists found', 404),
      );

      await expect(
        controller.getUserPlaylists({ user: { userId } }),
      ).rejects.toThrow(PlaylistException);
    });
  });

  describe('addSongToPlaylist', () => {
    it('should add a song to a playlist successfully', async () => {
      const playlistId = 1;
      const request: AddSongToPlaylistRequest = { songId: 2 };
      const response: PlaylistSongResponse = {
        id: 1,
        playlistId,
        songId: request.songId,
      };

      jest.spyOn(service, 'addSongToPlaylist').mockResolvedValue(response);

      const result = await controller.addSongToPlaylist(
        playlistId.toString(),
        request,
      );

      expect(result).toEqual(
        BaseResponse.successResponse(
          'Song added to playlist successfully',
          response,
        ),
      );
      expect(service.addSongToPlaylist).toHaveBeenCalledWith(
        playlistId,
        request.songId,
      );
    });

    it('should throw an exception if service fails', async () => {
      const playlistId = '1';
      const request: AddSongToPlaylistRequest = { songId: 2 };

      jest
        .spyOn(service, 'addSongToPlaylist')
        .mockRejectedValue(new PlaylistException('Error', 500));

      await expect(
        controller.addSongToPlaylist(playlistId, request),
      ).rejects.toThrow(PlaylistException);
    });
  });

  describe('removeSongFromPlaylist', () => {
    it('should remove a song from a playlist successfully', async () => {
      const playlistId = 1;
      const songId = 2;

      jest
        .spyOn(service, 'removeSongFromPlaylist')
        .mockResolvedValue(undefined);

      const result = await controller.removeSongFromPlaylist(
        playlistId.toString(),
        songId.toString(),
      );

      expect(result).toBeUndefined();
      expect(service.removeSongFromPlaylist).toHaveBeenCalledWith(
        playlistId,
        songId,
      );
    });

    it('should throw an exception if service fails', async () => {
      const playlistId = 1;
      const songId = 2;

      jest
        .spyOn(service, 'removeSongFromPlaylist')
        .mockRejectedValue(new PlaylistException('Error', 500));

      await expect(
        controller.removeSongFromPlaylist(
          playlistId.toString(),
          songId.toString(),
        ),
      ).rejects.toThrow(PlaylistException);
    });
  });

  describe('searchPlaylists', () => {
    it('should search playlists successfully', async () => {
      const name = 'Rock';
      const playlists: PlaylistResponse[] = [
        { id: 1, name: 'Rock Hits', genre: 'Rock', userId: 1 },
      ];

      jest.spyOn(service, 'searchPlaylists').mockResolvedValue(playlists);

      const result = await controller.searchPlaylists(name);

      expect(result).toEqual(
        BaseResponse.successResponse('Playlists search results', playlists),
      );
      expect(service.searchPlaylists).toHaveBeenCalledWith(name, undefined);
    });

    it('should throw an exception if service fails', async () => {
      const name = 'Rock';

      jest
        .spyOn(service, 'searchPlaylists')
        .mockRejectedValue(new PlaylistException('Error', 500));

      await expect(controller.searchPlaylists(name)).rejects.toThrow(
        PlaylistException,
      );
    });
  });
});

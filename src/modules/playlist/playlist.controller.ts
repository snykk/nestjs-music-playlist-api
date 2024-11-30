import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaylistService } from './playlist.service';
import {
  AddSongToPlaylistRequest,
  PlaylistRequest,
  PlaylistResponse,
  PlaylistSongResponse,
} from './playlist.dto';
import { PlaylistException } from './playlist.exception';
import { BaseResponse } from '../../common/base-response';

@Controller('/api/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post()
  async createPlaylist(
    @Req() req: any,
    @Body() playlistRequest: PlaylistRequest,
  ): Promise<BaseResponse<PlaylistResponse>> {
    try {
      const result: PlaylistResponse =
        await this.playlistService.createPlaylist(
          req.user.userId,
          playlistRequest,
        );
      return BaseResponse.successResponse(
        'Playlist created successfully',
        result,
      );
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get()
  async getUserPlaylists(
    @Req() req: any,
  ): Promise<BaseResponse<PlaylistResponse[]>> {
    try {
      const playlists = await this.playlistService.getUserPlaylists(
        req.user.userId,
      );
      return BaseResponse.successResponse(
        'User playlists retrieved successfully',
        playlists,
      );
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/:id/songs')
  async addSongToPlaylist(
    @Param('id') playlistId: number,
    @Body() songRequest: AddSongToPlaylistRequest,
  ): Promise<BaseResponse<PlaylistSongResponse>> {
    try {
      const result: PlaylistSongResponse =
        await this.playlistService.addSongToPlaylist(
          playlistId,
          songRequest.songId,
        );
      return BaseResponse.successResponse(
        'Song added to playlist successfully',
        result,
      );
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete('/:id/songs/:songId')
  async removeSongFromPlaylist(
    @Param('id') playlistId: number,
    @Param('songId') songId: number,
  ): Promise<null> {
    try {
      await this.playlistService.removeSongFromPlaylist(playlistId, songId);
      return;
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/search')
  async searchPlaylists(
    @Query('name') name?: string,
    @Query('genre') genre?: string,
  ): Promise<BaseResponse<PlaylistResponse[]>> {
    try {
      const playlists: PlaylistResponse[] =
        await this.playlistService.searchPlaylists(name, genre);
      return BaseResponse.successResponse(
        'Playlists search results',
        playlists,
      );
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaylistService } from './playlist.service';
import { PlaylistRequest } from './playlist.dto';
import { PlaylistException } from './playlist.exception';

@Controller('/api/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPlaylist(
    @Req() req: any,
    @Body() playlistRequest: PlaylistRequest,
  ) {
    try {
      const result = await this.playlistService.createPlaylist(
        req.user.userId,
        playlistRequest,
      );
      return { success: true, data: result };
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw new HttpException(e.message, e.getStatus());
      }

      if (e instanceof PlaylistException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserPlaylists(@Req() req: any) {
    try {
      console.log(req.user);
      const playlists = await this.playlistService.getUserPlaylists(
        req.user.userId,
      );
      return { success: true, data: playlists };
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/songs')
  async addSongToPlaylist(
    @Param('id') playlistId: number,
    @Body() songRequest: { songId: number },
  ) {
    try {
      const result = await this.playlistService.addSongToPlaylist(
        playlistId,
        songRequest.songId,
      );
      return { success: true, data: result };
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/songs/:songId')
  async removeSongFromPlaylist(
    @Param('id') playlistId: number,
    @Param('songId') songId: number,
  ) {
    try {
      await this.playlistService.removeSongFromPlaylist(playlistId, songId);
      return { success: true, message: 'Song removed successfully' };
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search')
  async searchPlaylists(
    @Query('name') name?: string,
    @Query('genre') genre?: string,
  ) {
    try {
      const playlists = await this.playlistService.searchPlaylists(name, genre);
      return { success: true, data: playlists };
    } catch (e) {
      if (e instanceof PlaylistException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

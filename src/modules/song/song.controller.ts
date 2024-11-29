import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SongService } from './song.service';
import { SongRequest, SongResponse, RatingRequest } from './song.dto';
import { SongException } from './song.exception';

@Controller('/api/songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSong(@Body() songRequest: SongRequest) {
    try {
      const songResponse = await this.songService.createSong(songRequest);
      return { success: true, data: songResponse };
    } catch (e) {
      if (e instanceof SongException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllSongs() {
    try {
      const songs = await this.songService.getAllSongs();
      return { success: true, data: songs };
    } catch (e) {
      if (e instanceof SongException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  async getSong(@Param('id') id: number) {
    try {
      const song = await this.songService.getSongById(id);
      if (!song) {
        throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
      }
      return { success: true, data: song };
    } catch (e) {
      if (e instanceof SongException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateSong(@Param('id') id: number, @Body() songRequest: SongRequest) {
    try {
      const updatedSong = await this.songService.updateSong(id, songRequest);
      return { success: true, data: updatedSong };
    } catch (e) {
      if (e instanceof SongException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteSong(@Param('id') id: number) {
    try {
      await this.songService.deleteSong(id);
      return { success: true, message: 'Song deleted successfully' };
    } catch (e) {
      if (e instanceof SongException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:songId/rate')
  async rateSong(
    @Req() req: any,
    @Param('songId') songId: number,
    @Body() ratingRequest: RatingRequest,
  ) {
    try {
      const result = await this.songService.rateSong(
        req.user.userId,
        songId,
        ratingRequest,
      );
      return { success: true, data: result };
    } catch (e) {
      if (e instanceof SongException) {
        throw new HttpException(e.message, e.getStatus());
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

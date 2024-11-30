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
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SongService } from './song.service';
import { SongRequest, SongResponse, RatingRequest } from './song.dto';
import { SongException } from './song.exception';

@Controller('/api/songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
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
  @HttpCode(200)
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
  @HttpCode(200)
  async getSong(@Param('id') id: string) {
    try {
      const song = await this.songService.getSongById(Number(id));

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
  @HttpCode(200)
  @Put('/:id')
  async updateSong(@Param('id') id: string, @Body() songRequest: SongRequest) {
    try {
      const updatedSong = await this.songService.updateSong(
        Number(id),
        songRequest,
      );
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
  @HttpCode(204)
  @Delete('/:id')
  async deleteSong(@Param('id') id: string) {
    try {
      await this.songService.deleteSong(Number(id));
      return; // no content
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
  @HttpCode(200)
  @Put('/:songId/rate')
  async rateSong(
    @Req() req: any,
    @Param('songId') songId: string,
    @Body() ratingRequest: RatingRequest,
  ) {
    try {
      const result = await this.songService.rateSong(
        req.user.userId,
        Number(songId),
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

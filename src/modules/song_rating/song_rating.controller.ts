import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SongRatingService } from './song_rating.service';
import { SongRatingExceptions } from './song_rating.exception';

@Controller('/api/song_ratings')
export class SongRatingController {
  constructor(private readonly songRatingService: SongRatingService) {}

  @Get()
  async getAllRatings() {
    try {
      const ratings = await this.songRatingService.getAllRatings();
      return { success: true, data: ratings };
    } catch (e) {
      if (e instanceof SongRatingExceptions) {
        throw new HttpException(e.message, e.getStatus());
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId')
  async getRatingsByUser(@Param('userId') userId: string) {
    try {
      const ratings = await this.songRatingService.getRatingsByUser(
        Number(userId),
      );
      return { success: true, data: ratings };
    } catch (e) {
      if (e instanceof SongRatingExceptions) {
        throw new HttpException(e.message, e.getStatus());
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/song/:songId')
  async getRatingsBySong(@Param('songId') songId: string) {
    try {
      const ratings = await this.songRatingService.getRatingsBySong(
        Number(songId),
      );
      return { success: true, data: ratings };
    } catch (e) {
      if (e instanceof SongRatingExceptions) {
        throw new HttpException(e.message, e.getStatus());
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(['/user/:userId/song/:songId', '/song/:songId/user/:userId'])
  async getRatingByUserAndSong(
    @Param('userId') userId: string,
    @Param('songId') songId: string,
  ) {
    try {
      const rating = await this.songRatingService.getRatingByUserAndSong(
        Number(userId),
        Number(songId),
      );
      return { success: true, data: rating };
    } catch (e) {
      if (e instanceof SongRatingExceptions) {
        throw new HttpException(e.message, e.getStatus());
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

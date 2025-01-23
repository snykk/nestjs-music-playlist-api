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
import { SongRatingResponse } from './song_rating.dto';
import { BaseResponse } from '../../common/base-response';

@Controller('/api/song_ratings')
export class SongRatingController {
  constructor(private readonly songRatingService: SongRatingService) {}

  @Get()
  async getAllRatings(): Promise<BaseResponse<SongRatingResponse[]>> {
    try {
      const ratings: SongRatingResponse[] =
        await this.songRatingService.getAllRatings();
      return BaseResponse.successResponse(
        'All song ratings retrieved successfully',
        ratings,
      );
    } catch (e) {
      if (e instanceof SongRatingExceptions) {
        throw e;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId')
  async getRatingsByUser(
    @Param('userId') userId: string,
  ): Promise<BaseResponse<SongRatingResponse[]>> {
    try {
      const ratings: SongRatingResponse[] =
        await this.songRatingService.getRatingsByUser(Number(userId));
      return BaseResponse.successResponse(
        'User song ratings retrieved successfully',
        ratings,
      );
    } catch (e) {
      if (e instanceof SongRatingExceptions) {
        throw e;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/song/:songId')
  async getRatingsBySong(
    @Param('songId') songId: string,
  ): Promise<BaseResponse<SongRatingResponse[]>> {
    try {
      const ratings: SongRatingResponse[] =
        await this.songRatingService.getRatingsBySong(Number(songId));
      return BaseResponse.successResponse(
        'Song ratings retrieved successfully',
        ratings,
      );
    } catch (e) {
      if (e instanceof SongRatingExceptions) {
        throw e;
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
  ): Promise<BaseResponse<SongRatingResponse>> {
    try {
      const rating: SongRatingResponse =
        await this.songRatingService.getRatingByUserAndSong(
          Number(userId),
          Number(songId),
        );
      return BaseResponse.successResponse(
        'User and song rating retrieved successfully',
        rating,
      );
    } catch (e) {
      if (e instanceof SongRatingExceptions) {
        throw e;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

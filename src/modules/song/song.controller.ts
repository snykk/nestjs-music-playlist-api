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
import { BaseResponse } from '../../common/base-response';
import { SongRatingResponse } from '../song_rating/song_rating.dto';

@Controller('/api/songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post()
  async createSong(
    @Body() songRequest: SongRequest,
  ): Promise<BaseResponse<SongResponse>> {
    try {
      const songResponse = await this.songService.createSong(songRequest);
      return BaseResponse.successResponse(
        'Song created successfully',
        songResponse,
      );
    } catch (e) {
      if (e instanceof SongException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @HttpCode(200)
  @Get()
  async getAllSongs(): Promise<BaseResponse<SongResponse[]>> {
    try {
      const songs = await this.songService.getAllSongs();
      return BaseResponse.successResponse(
        'Songs retrieved successfully',
        songs,
      );
    } catch (e) {
      if (e instanceof SongException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @HttpCode(200)
  @Get('/:id')
  async getSong(@Param('id') id: string): Promise<BaseResponse<SongResponse>> {
    try {
      const song = await this.songService.getSongById(Number(id));
      return BaseResponse.successResponse('Song retrieved successfully', song);
    } catch (e) {
      if (e instanceof SongException) {
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
  @Put('/:id')
  async updateSong(
    @Param('id') id: string,
    @Body() songRequest: SongRequest,
  ): Promise<BaseResponse<SongResponse>> {
    try {
      const updatedSong = await this.songService.updateSong(
        Number(id),
        songRequest,
      );
      return BaseResponse.successResponse(
        'Song updated successfully',
        updatedSong,
      );
    } catch (e) {
      if (e instanceof SongException) {
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
  @Delete('/:id')
  async deleteSong(@Param('id') id: string): Promise<null> {
    try {
      await this.songService.deleteSong(Number(id));
      return;
    } catch (e) {
      if (e instanceof SongException) {
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
  @Put('/:songId/rate')
  async rateSong(
    @Req() req: any,
    @Param('songId') songId: string,
    @Body() ratingRequest: RatingRequest,
  ): Promise<BaseResponse<SongRatingResponse>> {
    try {
      const result = await this.songService.rateSong(
        Number(req.user.userId),
        Number(songId),
        ratingRequest,
      );
      return BaseResponse.successResponse('Song rated successfully', result);
    } catch (e) {
      if (e instanceof SongException) {
        throw e;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

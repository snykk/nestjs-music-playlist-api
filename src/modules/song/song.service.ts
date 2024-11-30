import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SongRequest, SongResponse, RatingRequest } from './song.dto';
import { SongException } from './song.exception';

@Injectable()
export class SongService {
  constructor(private readonly prisma: PrismaService) {}

  async createSong(songRequest: SongRequest): Promise<SongResponse> {
    try {
      return await this.prisma.song.create({
        data: songRequest,
      });
    } catch (error) {
      throw new HttpException(
        'Error creating song',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllSongs(): Promise<SongResponse[]> {
    try {
      const songs = await this.prisma.song.findMany();
      if (songs.length === 0) {
        throw new SongException('No songs found', HttpStatus.NOT_FOUND);
      }
      return songs;
    } catch (error) {
      if (error instanceof SongException) {
        throw error;
      }

      throw new SongException(
        'Error fetching songs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSongById(id: number): Promise<SongResponse | null> {
    try {
      const song = await this.prisma.song.findUnique({
        where: { id },
      });

      if (!song) {
        throw new SongException('Song not found', HttpStatus.NOT_FOUND);
      }
      return song;
    } catch (error) {
      if (error instanceof SongException) {
        throw error;
      }

      throw new SongException(
        'Error fetching song by ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSong(
    id: number,
    songRequest: SongRequest,
  ): Promise<SongResponse> {
    try {
      const updatedSong = await this.prisma.song.update({
        where: { id },
        data: songRequest,
      });
      return updatedSong;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new SongException('Song not found', HttpStatus.NOT_FOUND);
      }

      throw new SongException(
        'Internal server error while updating song',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteSong(id: number): Promise<void> {
    try {
      await this.prisma.song.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new SongException('Song not found', HttpStatus.NOT_FOUND);
      }
      throw new SongException(
        'Error deleting song',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async rateSong(userId: number, songId: number, ratingRequest: RatingRequest) {
    try {
      return await this.prisma.songRating.upsert({
        where: {
          userId_songId: { userId, songId }, // Composite unique key
        },
        update: {
          rating: ratingRequest.rating, // Update the rating if record exists
        },
        create: {
          userId, // Create a new record if it doesn't exist
          songId,
          rating: ratingRequest.rating,
        },
      });
    } catch (error) {
      throw new SongException(
        'Error rating song',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

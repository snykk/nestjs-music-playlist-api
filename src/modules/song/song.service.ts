import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SongRequest, SongResponse, RatingRequest } from './song.dto';
import { SongException } from './song.exception';

@Injectable()
export class SongService {
  constructor(private readonly prisma: PrismaService) {}

  async createSong(songRequest: SongRequest): Promise<SongResponse> {
    return this.prisma.song.create({
      data: songRequest,
    });
  }

  async getAllSongs(): Promise<SongResponse[]> {
    return this.prisma.song.findMany();
  }

  async getSongById(id: number): Promise<SongResponse | null> {
    const song = await this.prisma.song.findUnique({
      where: { id: id },
    });

    if (!song) {
      throw new SongException('Song not found', HttpStatus.NOT_FOUND);
    }

    return song;
  }

  async updateSong(
    id: number,
    songRequest: SongRequest,
  ): Promise<SongResponse> {
    return this.prisma.song.update({
      where: { id },
      data: songRequest,
    });
  }

  async deleteSong(id: number): Promise<void> {
    await this.prisma.song.delete({
      where: { id },
    });
  }

  async rateSong(userId: number, songId: number, ratingRequest: RatingRequest) {
    return this.prisma.songRating.upsert({
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
  }
}

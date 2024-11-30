import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SongRatingExceptions } from './song_rating.exception';

@Injectable()
export class SongRatingService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRatings() {
    const ratings = await this.prisma.songRating.findMany({
      include: {
        user: { select: { id: true, username: true } },
        song: { select: { id: true, title: true } },
      },
    });

    if (ratings.length === 0) {
      throw new SongRatingExceptions('No ratings found', HttpStatus.NOT_FOUND);
    }

    return ratings;
  }

  async getRatingsByUser(userId: number) {
    const ratings = await this.prisma.songRating.findMany({
      where: { userId },
      include: {
        song: { select: { id: true, title: true, artist: true } },
      },
    });

    if (ratings.length === 0) {
      throw new SongRatingExceptions(
        `No ratings found for user with ID ${userId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return ratings;
  }

  async getRatingsBySong(songId: number) {
    const ratings = await this.prisma.songRating.findMany({
      where: { songId },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    if (ratings.length === 0) {
      throw new SongRatingExceptions(
        `No ratings found for song with ID ${songId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return ratings;
  }

  async getRatingByUserAndSong(userId: number, songId: number) {
    const rating = await this.prisma.songRating.findUnique({
      where: { userId_songId: { userId, songId } },
      include: {
        user: { select: { id: true, username: true } },
        song: { select: { id: true, title: true, artist: true } },
      },
    });

    if (!rating) {
      throw new SongRatingExceptions(
        `No rating found for user ID ${userId} and song ID ${songId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return rating;
  }
}

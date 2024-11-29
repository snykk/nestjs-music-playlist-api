import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlaylistRequest, SongRequest, RatingRequest } from './playlist.dto';
import { PlaylistException } from './playlist.exception';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlaylist(userId: number, playlistRequest: PlaylistRequest) {
    return this.prisma.playlist.create({
      data: {
        userId,
        ...playlistRequest,
      },
    });
  }

  async getUserPlaylists(userId: number) {
    return this.prisma.playlist.findMany({
      where: { userId },
      include: { songs: true },
    });
  }

  async addSongToPlaylist(playlistId: number, songId: number) {
    const song = await this.prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      throw new PlaylistException('Song not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.playlistSong.create({
      data: { playlistId, songId },
    });
  }

  async removeSongFromPlaylist(playlistId: number, songId: number) {
    const song = await this.prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      throw new PlaylistException('Song not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.playlistSong.deleteMany({
      where: { playlistId, songId },
    });
  }

  async searchPlaylists(name?: string, genre?: string) {
    return this.prisma.playlist.findMany({
      where: {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(genre && { genre: { contains: genre, mode: 'insensitive' } }),
      },
    });
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PlaylistRequest,
  PlaylistResponse,
  PlaylistSongResponse,
} from './playlist.dto';
import { PlaylistException } from './playlist.exception';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlaylist(
    userId: number,
    playlistRequest: PlaylistRequest,
  ): Promise<PlaylistResponse> {
    try {
      return await this.prisma.playlist.create({
        data: {
          userId,
          ...playlistRequest,
        },
      });
    } catch (error) {
      throw new PlaylistException(
        'Error creating playlist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserPlaylists(userId: number): Promise<PlaylistResponse[]> {
    try {
      const playlists = await this.prisma.playlist.findMany({
        where: { userId },
        include: { songs: true },
      });

      if (playlists.length === 0) {
        throw new PlaylistException('No playlists found', HttpStatus.NOT_FOUND);
      }

      return playlists;
    } catch (error) {
      if (error instanceof PlaylistException) {
        throw error;
      }

      throw new PlaylistException(
        'Error fetching playlists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addSongToPlaylist(
    playlistId: number,
    songId: number,
  ): Promise<PlaylistSongResponse> {
    try {
      const song = await this.prisma.song.findUnique({
        where: { id: songId },
      });

      if (!song) {
        throw new PlaylistException('Song not found', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.playlistSong.create({
        data: { playlistId, songId },
      });
    } catch (error) {
      if (error instanceof PlaylistException) {
        throw error;
      }

      throw new PlaylistException(
        'Error adding song to playlist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeSongFromPlaylist(playlistId: number, songId: number) {
    try {
      const song = await this.prisma.song.findUnique({
        where: { id: songId },
      });

      if (!song) {
        throw new PlaylistException('Song not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.playlistSong.deleteMany({
        where: { playlistId, songId },
      });
    } catch (error) {
      if (error instanceof PlaylistException) {
        throw error;
      }

      throw new PlaylistException(
        'Error removing song from playlist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchPlaylists(name?: string, genre?: string) {
    try {
      const playlists = await this.prisma.playlist.findMany({
        where: {
          ...(name && { name: { contains: name, mode: 'insensitive' } }),
          ...(genre && { genre: { contains: genre, mode: 'insensitive' } }),
        },
      });

      if (playlists.length === 0) {
        throw new PlaylistException('No playlists found', HttpStatus.NOT_FOUND);
      }

      return playlists;
    } catch (error) {
      if (error instanceof PlaylistException) {
        throw error;
      }

      throw new PlaylistException(
        'Error searching playlists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

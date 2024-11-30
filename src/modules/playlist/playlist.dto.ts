import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PlaylistRequest {
  @IsNotEmpty({ message: 'Playlist name is required' })
  @IsString({ message: 'Playlist name must be a string' })
  @Length(3, 100, {
    message: 'Playlist name must be between 3 and 100 characters',
  })
  name: string;

  @IsNotEmpty({ message: 'Genre is required' })
  @IsString({ message: 'Genre must be a string' })
  @Length(3, 50, { message: 'Genre must be between 3 and 50 characters' })
  genre: string;
}

export class PlaylistResponse {
  id: number;
  name: string;
  genre: string;
  userId: number;
}

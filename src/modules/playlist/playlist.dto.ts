export class PlaylistRequest {
  name: string;
  genre: string;
}

export class PlaylistResponse {
  id: number;
  name: string;
  genre: string;
  userId: number;
}

export class SongRequest {
  title: string;
  artist: string;
  album?: string;
  filePath: string;
}

export class RatingRequest {
  rating: number;
}

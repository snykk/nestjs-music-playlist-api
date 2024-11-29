export class SongRequest {
  title: string;
  artist: string;
  album?: string;
  filePath: string;
}

export class SongResponse {
  id: number;
  title: string;
  artist: string;
  album?: string;
  filePath: string;
}

export class RatingRequest {
  rating: number;
}

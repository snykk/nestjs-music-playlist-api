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

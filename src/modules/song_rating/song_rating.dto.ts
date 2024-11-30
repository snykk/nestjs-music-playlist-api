export class SongRatingResponse {
  id: number;
  userId: number;
  songId: number;
  rating: number;
  user?: object;
  song?: object;
}

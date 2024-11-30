import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { SongModule } from './modules/song/song.module';
import { SongRatingModule } from './modules/song_rating/song_rating.module';

@Module({
  imports: [AuthModule, PlaylistModule, SongModule, SongRatingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

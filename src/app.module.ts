import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { SongModule } from './modules/song/song.module';

@Module({
  imports: [AuthModule, PlaylistModule, SongModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

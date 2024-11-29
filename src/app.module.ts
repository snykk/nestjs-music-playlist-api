import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PlaylistModule } from './modules/playlist/playlist.module';

@Module({
  imports: [AuthModule, PlaylistModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

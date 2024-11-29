import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';

@Module({
  imports: [PrismaModule],
  providers: [PlaylistService],
  controllers: [PlaylistController],
})
export class PlaylistModule {}

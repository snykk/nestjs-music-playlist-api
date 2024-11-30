import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SongRatingService } from './song_rating.service';
import { SongRatingController } from './song_rating.controller';

@Module({
  imports: [PrismaModule],
  providers: [SongRatingService],
  controllers: [SongRatingController],
})
export class SongRatingModule {}

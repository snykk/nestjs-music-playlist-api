import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SongService } from './song.service';
import { SongController } from './song.controller';

@Module({
  imports: [PrismaModule],
  providers: [SongService],
  controllers: [SongController],
})
export class SongModule {}

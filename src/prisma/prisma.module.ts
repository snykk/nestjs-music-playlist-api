import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SongSeeder } from './seeds/song-seeder';

@Global()
@Module({
  providers: [PrismaService, SongSeeder],
  exports: [PrismaService],
})
export class PrismaModule {}

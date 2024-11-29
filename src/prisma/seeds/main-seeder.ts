import { NestFactory } from '@nestjs/core';
import { PrismaModule } from '../prisma.module';
import { SongSeeder } from './song-seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(PrismaModule);
  const songSeeder = app.get(SongSeeder);
  await songSeeder.seed();
  await app.close();
}

bootstrap();

import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SongSeeder {
  constructor(private readonly prismaService: PrismaService) {}

  async seed() {
    const songs = [
      {
        title: 'Enter Sandman',
        artist: 'Metallica',
        album: 'Metallica',
        filePath: '/songs/enter_sandman.mp3',
      },
      {
        title: 'Nightmare',
        artist: 'Avenged Sevenfold',
        album: 'Nightmare',
        filePath: '/songs/nightmare.mp3',
      },
      {
        title: 'Monster',
        artist: 'Skillet',
        album: 'Awake',
        filePath: '/songs/monster.mp3',
      },
      {
        title: 'Pull Me Under',
        artist: 'Dream Theater',
        album: 'Images and Words',
        filePath: '/songs/pull_me_under.mp3',
      },
      {
        title: 'King for a Day',
        artist: 'Pierce the Veil',
        album: 'Collide with the Sky',
        filePath: '/songs/king_for_a_day.mp3',
      },
      {
        title: 'Sad But True',
        artist: 'Metallica',
        album: 'Metallica',
        filePath: '/songs/sad_but_true.mp3',
      },
      {
        title: 'Hail to the King',
        artist: 'Avenged Sevenfold',
        album: 'Hail to the King',
        filePath: '/songs/hail_to_the_king.mp3',
      },
      {
        title: 'The Last Night',
        artist: 'Skillet',
        album: 'Comatose',
        filePath: '/songs/the_last_night.mp3',
      },
      {
        title: 'The Dance of Eternity',
        artist: 'Dream Theater',
        album: 'Metropolis Pt. 2: Scenes from a Memory',
        filePath: '/songs/the_dance_of_eternity.mp3',
      },
      {
        title: 'Caraphernelia',
        artist: 'Pierce the Veil',
        album: 'Selfish Machines',
        filePath: '/songs/caraphernelia.mp3',
      },
      {
        title: 'Master of Puppets',
        artist: 'Metallica',
        album: 'Master of Puppets',
        filePath: '/songs/master_of_puppets.mp3',
      },
      {
        title: 'Afterlife',
        artist: 'Avenged Sevenfold',
        album: 'Avenged Sevenfold',
        filePath: '/songs/afterlife.mp3',
      },
      {
        title: 'Rise',
        artist: 'Skillet',
        album: 'Rise',
        filePath: '/songs/rise.mp3',
      },
      {
        title: 'A Change of Seasons',
        artist: 'Dream Theater',
        album: 'A Change of Seasons',
        filePath: '/songs/a_change_of_seasons.mp3',
      },
      {
        title: 'Bulls in the Bronx',
        artist: 'Pierce the Veil',
        album: 'Selfish Machines',
        filePath: '/songs/bulls_in_the_bronx.mp3',
      },
      {
        title: 'For Whom the Bell Tolls',
        artist: 'Metallica',
        album: 'Ride the Lightning',
        filePath: '/songs/for_whom_the_bell_tolls.mp3',
      },
      {
        title: 'Unholy Confessions',
        artist: 'Avenged Sevenfold',
        album: 'Waking the Fallen',
        filePath: '/songs/unholy_confessions.mp3',
      },
      {
        title: 'Comatose',
        artist: 'Skillet',
        album: 'Comatose',
        filePath: '/songs/comatose.mp3',
      },
      {
        title: 'The Spirit Carries On',
        artist: 'Dream Theater',
        album: 'Metropolis Pt. 2: Scenes from a Memory',
        filePath: '/songs/the_spirit_carries_on.mp3',
      },
      {
        title: 'Yeah Boy',
        artist: 'Pierce the Veil',
        album: 'Misadventures',
        filePath: '/songs/yeah_boy.mp3',
      },
    ];

    for (const song of songs) {
      await this.prismaService.song.create({
        data: song,
      });
    }

    console.log('Songs seeded successfully');
  }
}

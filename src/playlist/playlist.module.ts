import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { PlaylistRepository } from './playlist.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { MusicRepository } from 'src/music/music.repository';
import { MusicEntity } from 'src/music/entities/music.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistEntity, MusicEntity])],
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistRepository, MusicRepository],
})
export class PlaylistModule {}

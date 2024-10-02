import { forwardRef, Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { PlaylistRepository } from './playlist.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { MusicRepository } from 'src/music/music.repository';
import { AuthorRepository } from 'src/author/author.repository';
import { MusicModule } from 'src/music/music.module';
import { AuthorModule } from 'src/author/author.module';
import { MusicEntity } from 'src/music/entities/music.entity';
import { AuthorEntity } from 'src/author/entities/author.entity';
import { AlbumRepository } from 'src/album/album.repository';
import { AlbumEntity } from 'src/album/entities/album.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistEntity, MusicEntity, AuthorEntity, AlbumEntity]),
  forwardRef(() => MusicModule),
  forwardRef(() => AuthorModule),
  forwardRef(() => FilesModule)],
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistRepository, MusicRepository, AuthorRepository, AlbumRepository],
  exports: [PlaylistRepository]
})
export class PlaylistModule {}

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
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { StatsEntity } from 'src/stats/entities/stat.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PlaylistEntity, MusicEntity, AuthorEntity, UserEntity, AlbumEntity, StatsEntity]),
  forwardRef(() => UserModule),
  forwardRef(() => PlaylistModule),
  forwardRef(() => MusicModule),
  forwardRef(() => AuthorModule),
  forwardRef(() => FilesModule),
],
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistRepository, MusicRepository, AuthorRepository, AlbumRepository, UserRepository],
  exports: [PlaylistRepository]
})
export class PlaylistModule {}

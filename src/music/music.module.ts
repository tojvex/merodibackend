import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { MusicRepository } from './music.repository';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { AuthorEntity } from 'src/author/entities/author.entity';
import { AlbumEntity } from 'src/album/entities/album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MusicEntity, AuthorEntity, AlbumEntity])
  ],
  providers: [MusicRepository, MusicService],
  controllers: [MusicController],
  exports: [MusicRepository],
})
export class MusicModule {}

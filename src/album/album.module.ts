import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './entities/album.entity';
import { AlbumRepository } from './album.repository';
import { MusicModule } from 'src/music/music.module';
import { AuthorModule } from 'src/author/author.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity]),
    forwardRef ( () => MusicModule),
    forwardRef ( () => AuthorModule),
    forwardRef ( () => FilesModule)
  ],
  controllers: [AlbumController],
  providers: [AlbumService,AlbumRepository],
  exports: [AlbumRepository]
})
export class AlbumModule {}

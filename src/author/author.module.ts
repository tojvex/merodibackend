import { forwardRef, Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { AuthorRepository } from './author.repository';
import { MusicModule } from 'src/music/music.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorEntity]),
    AlbumModule,
    forwardRef ( () => MusicModule)
  ],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository],
  exports: [AuthorRepository]
})
export class AuthorModule {}

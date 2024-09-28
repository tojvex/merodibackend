import { forwardRef, Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { MusicRepository } from './music.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { AuthorModule } from 'src/author/author.module';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MusicEntity]),
   forwardRef( () =>  AuthorModule),
    StatsModule],
  controllers: [MusicController],
  providers: [MusicService, MusicRepository],
  exports: [MusicRepository]

})
export class MusicModule {}

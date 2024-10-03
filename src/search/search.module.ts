import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MusicModule } from 'src/music/music.module';
import { AuthorModule } from 'src/author/author.module';
import { AlbumModule } from 'src/album/album.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MusicModule, AlbumModule, AuthorModule, UserModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
 
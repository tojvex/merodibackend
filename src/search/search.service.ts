import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { MusicRepository } from 'src/music/music.repository';
import { AlbumRepository } from 'src/album/album.repository';
import { AuthorRepository } from 'src/author/author.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class SearchService {
  constructor(private readonly musicRepo: MusicRepository,
              private readonly authorRepo: AuthorRepository,
              private readonly albumRepo: AlbumRepository,
              private readonly userRepo: UserRepository
  ) {}
 
 async search(data: CreateSearchDto) {
      const musics = await this.musicRepo.search(data.query)
      const authors =  await this.authorRepo.search(data.query)
      const albums = await this.albumRepo.search(data.query)
      const users = await this.userRepo.search(data.query)
    
      return  {

        musics,
        authors,
        albums,
        users

      }

  }
}

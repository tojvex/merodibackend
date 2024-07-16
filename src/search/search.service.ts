import { Injectable } from '@nestjs/common';
import { CreateSearchDto} from './dto/create-search.dto'
import { MusicRepository } from 'src/music/music.repository';

@Injectable()
export class SearchService {
  constructor(private readonly musicRepository: MusicRepository) {}

  async search(searchDto: CreateSearchDto) {
    const { searchTerm } = searchDto;
    return await this.musicRepository.search(searchTerm);
  }
}

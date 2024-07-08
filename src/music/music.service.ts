import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { MusicRepository } from './music.repository';

@Injectable()
export class MusicService {
  constructor(private readonly MusicRepository:MusicRepository) {}
 async create(createMusicDto: CreateMusicDto) {
    return await this.MusicRepository.create(createMusicDto);
  }

 async findAll() {
    return await this.MusicRepository.findAll();
  }

 async findOne(id: number) {
    return await this.MusicRepository.findOne(id);
  }

 async update(id: number, updateMusicDto: UpdateMusicDto) {
    return await this.MusicRepository.update(id, updateMusicDto);
  }

  async remove(id: number) {
    return await this.MusicRepository.remove(id)
  }
}

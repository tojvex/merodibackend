import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { MusicRepository } from './music.repository';

@Injectable()
export class MusicService {
  constructor(private readonly MusicRepository:MusicRepository) {}
  create(createMusicDto: CreateMusicDto) {
    return this.MusicRepository.create(createMusicDto);
  }

  findAll() {
    return this.MusicRepository.findAll();
  }

  findOne(id: number) {
    return this.MusicRepository.findOne(id);
  }

  update(id: number, updateMusicDto: UpdateMusicDto) {
    return this.MusicRepository.update(id, updateMusicDto);
  }

  remove(id: number) {
    return this.MusicRepository.remove(id)
  }
}

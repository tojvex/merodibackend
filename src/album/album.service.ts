import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumRepository } from './album.repository';

@Injectable()
export class AlbumService {
  constructor(private readonly albumRepo: AlbumRepository) {}

  async create(createAlbumDto: CreateAlbumDto) {
    return await this.albumRepo.create(createAlbumDto);
  }

 async findAll() {
    return await this.albumRepo.findAll();
  }

  async findOne(id: number) {
    return await this.albumRepo.findOne(id);
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return await this.albumRepo.update(id, updateAlbumDto);
  }

  async remove(id: number) {
    return await this.albumRepo.remove(id)
  }
}

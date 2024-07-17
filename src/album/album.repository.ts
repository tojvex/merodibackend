import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

  @Injectable()
  export class AlbumRepository {
      constructor(@InjectRepository (AlbumEntity)
  private albumRepository: Repository <AlbumEntity>) {}
    async create(createAlbumDto: CreateAlbumDto) {
      
      const album =  await this.albumRepository
      .createQueryBuilder()
      .insert()
      .values(createAlbumDto)
      .execute()

      return album.generatedMaps[0]
      
    }

  async findAll() {
    return await  this.albumRepository
      .createQueryBuilder()
      .getMany()

      
    }

  async  findOne(id: number) {
    return await this.albumRepository
      .createQueryBuilder('album')
      .where('album.id = :id', {id})
      .getOne()

    }

  async update(id: number, updateAlbumDto: UpdateAlbumDto) {
      await this.albumRepository
      .createQueryBuilder('album')
      .update()
      .set(updateAlbumDto)
      .execute()

      return await this.albumRepository.findOneBy({ id })
    
    }

    async remove(id: number) {
      await this.albumRepository
        .createQueryBuilder('album')
        .softDelete()
        .from(AlbumEntity)
        .where('album.id = :id', { id })
        .execute()

    return await this.albumRepository
        .createQueryBuilder('album')
        .withDeleted()
        .where('album.id = :id', { id } )
        .getOne()
    }
  }
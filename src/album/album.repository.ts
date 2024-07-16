import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumRepository {
  
  constructor(@InjectRepository(AlbumEntity)
  private AlbumRepository: Repository<AlbumEntity>) { }
  
  async create(createalbumDto: CreateAlbumDto) {

    const album = await this.AlbumRepository
      .createQueryBuilder()
      .insert()
      .values(createalbumDto)
      .execute()

    return album.generatedMaps[0]
  }

  async findAll() {
    return await this.AlbumRepository
      .createQueryBuilder()
      .getMany()


  }

  async findOne(id: number) {
    return await this.AlbumRepository
      .createQueryBuilder('album')
      .where('album.id = :id', { id })
      .getOne()

  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto) {
    await this.AlbumRepository
      .createQueryBuilder('album')
      .update()
      .set(updateAlbumDto)
      .execute()

    return await this.AlbumRepository.findOneBy({ id })

  }

  async remove(id: number) {
    await this.AlbumRepository
      .createQueryBuilder('album')
      .softDelete()
      .from(AlbumEntity)
      .where('album.id = :id', { id })
      .execute()

    return await this.AlbumRepository
      .createQueryBuilder('album')
      .withDeleted()
      .where('album.id = :id', { id })
      .getOne()
  }
}
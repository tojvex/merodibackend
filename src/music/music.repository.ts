import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Music } from './entities/music.entity';
import { Repository } from 'typeorm';
import { Author } from 'src/author/entities/author.entity';

@Injectable()
export class MusicRepository {
    constructor(@InjectRepository (Music)
private MusicRepository: Repository <Music>) {}
  async create(createMusicDto: CreateMusicDto) {
    
    const music =  await this.MusicRepository
    .createQueryBuilder()
    .insert()
    .into(Music)
    .values(createMusicDto)
    .execute()

    return music.generatedMaps[0]
    
  }

  findAll() {
    return this.MusicRepository
    .createQueryBuilder('music')
    .leftJoinAndSelect('music.author', 'author')
    .getMany()
  }

  findOne(id: number) {
    return this.MusicRepository
    .createQueryBuilder('music')
    .where('music.id = :id', {id})
    .getOne()
  }

 async update(id: number, updateMusicDto: UpdateMusicDto) {
    await this.MusicRepository
    .createQueryBuilder('music')
    .update()
    .set(updateMusicDto)
    .execute()

    return this.MusicRepository.findOneBy({id})
  
  }

  async remove(id: number) {
    await this.MusicRepository
      .createQueryBuilder('music')
      .softDelete()
      .from(Music)
      .where('music.id = :id', {id})
      .execute()

   return this.MusicRepository
      .createQueryBuilder('music')
      .withDeleted()
      .where('music.id = :id', {id} )
      .execute()
  }
}
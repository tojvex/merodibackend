import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MusicRepository {
  constructor(@InjectRepository(MusicEntity)
  private MusicRepository: Repository<MusicEntity>) { }
  async create(createMusicDto: CreateMusicDto) {

    const music = await this.MusicRepository
      .createQueryBuilder()
      .insert()
      .values(createMusicDto)
      .execute()

    return music.generatedMaps[0]

  }

  async findAll() {
    return await this.MusicRepository
      .createQueryBuilder('music')
      .leftJoinAndSelect('music.album', 'album')
      .getMany()


  }

  async findOne(id: number) {
    return await this.MusicRepository
      .createQueryBuilder('music')
      .where('music.id = :id', { id })
      .getOne()

  }

  async update(id: number, updateMusicDto: UpdateMusicDto) {
    await this.MusicRepository
      .createQueryBuilder('music')
      .update()
      .set(updateMusicDto)
      .execute()

    return this.MusicRepository.findOneBy({ id })

  }

  async remove(id: number) {
    await this.MusicRepository
      .createQueryBuilder('music')
      .softDelete()
      .from(MusicEntity)
      .where('music.id = :id', { id })
      .execute()

    return this.MusicRepository
      .createQueryBuilder('music')
      .withDeleted()
      .where('music.id = :id', { id })
      .execute()
  }
}
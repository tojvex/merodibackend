import { Inject, Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { Repository } from 'typeorm';
import { AuthorEntity } from 'src/author/entities/author.entity';
import { AlbumRepository } from 'src/album/album.repository';
import { AlbumEntity } from 'src/album/entities/album.entity';

@Injectable()
export class MusicRepository {
    constructor(@InjectRepository (MusicEntity) 
                private musicRepository: Repository <MusicEntity>,
                @InjectRepository (AuthorEntity)
                private authorRepository: Repository <AuthorEntity>,
                @InjectRepository (AlbumEntity)
                private albumRepository: Repository <AlbumRepository>
) {}

  async create(createMusicDto: CreateMusicDto) {
    
    const music =  await this.musicRepository
    .createQueryBuilder()
    .insert()
    .values(createMusicDto)
    .execute()

    return music.generatedMaps[0]
    
  }

 async findAll() {
   return await  this.musicRepository
    .createQueryBuilder('music')
    .leftJoinAndSelect('music.album', 'album')
    .getMany()

    
  }

async  findOne(id: number) {
   return await this.musicRepository
    .createQueryBuilder('music')
    .where('music.id = :id', {id})
    .getOne()

  }

 async update(id: number, updateMusicDto: UpdateMusicDto) {
    await this.musicRepository
    .createQueryBuilder('music')
    .update()
    .set(updateMusicDto)
    .execute()

    return this.musicRepository.findOneBy({id})
  
  }

  async remove(id: number) {
    await this.musicRepository
      .createQueryBuilder('music')
      .softDelete()
      .from(MusicEntity)
      .where('music.id = :id', {id})
      .execute()

   return this.musicRepository
      .createQueryBuilder('music')
      .withDeleted()
      .where('music.id = :id', {id} )
      .execute()
  }

  async search(term: string) {
    const authors = await this.authorRepository
      .createQueryBuilder('author')
      .where('author.firstName LIKE :term', { term: `%${term}%` })
      .orWhere('author.lastName LIKE :term', {term: `%${term}%`} )
      .getMany();

    const albums = await this.albumRepository
      .createQueryBuilder('album')
      .where('album.title LIKE :term', { term: `%${term}%` })
      .getMany();

    const musics = await this.musicRepository
      .createQueryBuilder('music')
      .where('music.name LIKE :term', { term: `%${term}%` })
      .getMany();

    return { authors, albums, musics };
}
}
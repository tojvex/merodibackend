import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { Repository } from 'typeorm';
import { AuthorRepository } from 'src/author/author.repository';

@Injectable()
export class MusicRepository {
  constructor(@InjectRepository(MusicEntity)
  private readonly MusicRepository: Repository<MusicEntity>,
  private readonly authorRepo: AuthorRepository,
) { }

  async create(createMusicDto: CreateMusicDto) {
    const newMusic = new MusicEntity
    const authorArr = []
    newMusic.name = createMusicDto.name
    newMusic.duration = createMusicDto.duration
    newMusic.imageUrl = createMusicDto.imageUrl


    if (createMusicDto.authors && createMusicDto.authors.length > 0) {
      for (let i = 0; i < createMusicDto.authors.length; i++) {
        const author = await this.authorRepo.findOne(+createMusicDto.authors[i])
        authorArr.push(author)

      }
    }
    newMusic.authors = authorArr

    return await this.MusicRepository.save(newMusic)

  }


  async findAll() {
    return await this.MusicRepository
      .createQueryBuilder('music')
      .leftJoinAndSelect('music.album', 'album')
      .leftJoinAndSelect('music.authors', 'authors')
      .getMany()
  }

  async findOne(id: number) {
    return await this.MusicRepository
      .createQueryBuilder('music')
      .where('music.id = :id', { id })
      .leftJoinAndSelect('music.album', 'album')
      .leftJoinAndSelect('music.authors', 'authors')
      .getOne()
  }

  async update(id: number, updateMusicDto: UpdateMusicDto) {
    const musicToUpdate = await this.MusicRepository.findOneBy({ id });

    if (!musicToUpdate) {
      throw new Error('Music entity not found');
    }

    musicToUpdate.name = updateMusicDto.name || musicToUpdate.name;
    musicToUpdate.duration = updateMusicDto.duration || musicToUpdate.duration;

    if (updateMusicDto.authors) {
      const authorArr = [];
      for (let i = 0; i < updateMusicDto.authors.length; i++) {
        const author = await this.authorRepo.findOne(+updateMusicDto.authors[i]);
        if (author) {
          authorArr.push(author);
        }
      }
      musicToUpdate.authors = authorArr;
    }

    return await this.MusicRepository.save(musicToUpdate);
  }


  async remove(id: number) {
    await this.MusicRepository
      .createQueryBuilder('music')
      .softDelete()
      .where('id = :id', { id })
      .execute();

    return this.MusicRepository
      .createQueryBuilder('music')
      .withDeleted()
      .where('id = :id', { id })
      .getOne();
  }


  async search(query: string) {
    return this.MusicRepository
      .createQueryBuilder('music')
      .where('music.name LIKE :query', { query: `%${query}%` })
      .getMany()
  }
}
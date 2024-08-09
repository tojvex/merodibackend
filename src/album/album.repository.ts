import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { MusicRepository } from 'src/music/music.repository';
import { AuthorRepository } from 'src/author/author.repository';

@Injectable()
export class AlbumRepository {

  constructor(@InjectRepository(AlbumEntity)
  private AlbumRepository: Repository<AlbumEntity>,
    @Inject(forwardRef(() => MusicRepository))
    private readonly musicRepo: MusicRepository,
    @Inject(forwardRef(() => AuthorRepository))
    private readonly authorRepo: AuthorRepository) { }

  async create(createalbumDto: CreateAlbumDto) {
    const album = new AlbumEntity

    album.title = createalbumDto.title
    album.releaseDate = createalbumDto.releaseDate

    const musics = []
    const authors = []

    for (let i = 0; i < createalbumDto.musics.length; i++) {
      const music =  await this.musicRepo.findOne(+createalbumDto.musics[i])
      musics.push(music)
    }

    album.musics = musics

    for (let i = 0; i < createalbumDto.authors.length; i++) {
      const author = await this.authorRepo.findOne(+createalbumDto.authors[i])
      authors.push(author)
    }

    album.authors = authors

    return await this.AlbumRepository.save(album)
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

    const album = await this.AlbumRepository.findOne({ where: { id } });
    if (!album) {
        throw new NotFoundException(`Album with ID ${id} not found`);
    }

    album.title = updateAlbumDto.title || album.title;
    album.releaseDate = updateAlbumDto.releaseDate || album.releaseDate;

    if (updateAlbumDto.musics) {
        const musics = [];
        for (let i = 0; i < updateAlbumDto.musics.length; i++) {
            const music = await this.musicRepo.findOne(+updateAlbumDto.musics[i]);
            if (music) {
                musics.push(music);
            }
        }
        album.musics = musics;
    }

   
    if (updateAlbumDto.authors) {
        const authors = [];
        for (let i = 0; i < updateAlbumDto.authors.length; i++) {
            const author = await this.authorRepo.findOne(+updateAlbumDto.authors[i]);
            if (author) {
                authors.push(author);
            }
        }
        album.authors = authors;
    }
    return await this.AlbumRepository.save(album);
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

  async search(query: string) {
    return this.AlbumRepository
      .createQueryBuilder('album')
      .where('album.title LIKE :query', { query: `%${query}%` })
      .getMany()
  }
}
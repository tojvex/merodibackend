import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { MusicRepository } from 'src/music/music.repository';
import { AuthorRepository } from 'src/author/author.repository';
import { FilesRepository } from 'src/files/files.repository';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AlbumRepository {

  constructor(@InjectRepository(AlbumEntity)
  private AlbumRepository: Repository<AlbumEntity>,
    @Inject(forwardRef(() => MusicRepository))
    private readonly musicRepo: MusicRepository,
    @Inject(forwardRef(() => AuthorRepository))
    private readonly authorRepo: AuthorRepository,
    private readonly filesService: FilesService) { }

  async create(createalbumDto: CreateAlbumDto) {
    const imageUrl = (await this.filesService.getFile(createalbumDto.imageId)).url
    const album = new AlbumEntity

    album.title = createalbumDto.title
    album.releaseDate = createalbumDto.releaseDate
    album.description = createalbumDto.description
    album.imageUrl = imageUrl

    const musics = []
    const authors = []

    if (createalbumDto.musics && createalbumDto.musics.length > 0) {
      for (let i = 0; i < createalbumDto.musics.length; i++) {
        const music = await this.musicRepo.findOne(+createalbumDto.musics[i])
        musics.push(music)
        console.log(music)
      }
    }
    album.musics = musics


    if (createalbumDto.authors.length) {
      for (let i = 0; i < createalbumDto.authors.length; i++) {
        const firstName = createalbumDto.authors[i].split(' ')[0]
        const lastName = createalbumDto.authors[i].split(' ')[1]
        const author = await this.authorRepo.findOneByFirstNameOrLastName(firstName, lastName)
        authors.push(...author)
      }
    }

    if(!authors.length){
      throw new NotFoundException('Author was not found')
    }

    album.authors = authors

    return await this.AlbumRepository.save(album)
  }

  async findAll() {
    return await this.AlbumRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.musics', 'music')
      .leftJoinAndSelect('album.authors', 'author')
      .getMany()
  }

  async findOne(id: number) {
    return await this.AlbumRepository
      .createQueryBuilder('album')
      .where('album.id = :id', { id })
      .leftJoinAndSelect('album.musics', 'music')
      .leftJoinAndSelect('music.authors', 'authors')
      .leftJoinAndSelect('album.authors', 'author')
      .getOne()

  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto) {

    const album = await this.AlbumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    album.title = updateAlbumDto.title || album.title;
    album.releaseDate = updateAlbumDto.releaseDate || album.releaseDate;
    album.description = updateAlbumDto.description || album.description

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
      .createQueryBuilder()
      .softDelete()
      .from(AlbumEntity)
      .where('id = :id', { id })
      .execute()

    return await this.AlbumRepository
      .createQueryBuilder('album')
      .withDeleted()
      .where('id = :id', { id })
      .getOne()
  }

  async search(query: string) {
    return this.AlbumRepository
      .createQueryBuilder('album')
      .where('album.title LIKE :query', { query: `%${query}%` })
      .getMany()
  }
}
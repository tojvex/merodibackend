import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { Repository } from 'typeorm';
import { AuthorRepository } from 'src/author/author.repository';
import { FilesRepository } from 'src/files/files.repository';
import { FilesService } from 'src/files/files.service';
import { StatsEntity } from 'src/stats/entities/stat.entity';

@Injectable()
export class MusicRepository {
  constructor(@InjectRepository(MusicEntity)
  private readonly MusicRepository: Repository<MusicEntity>,
              @InjectRepository(StatsEntity)
  private readonly statsEntity: Repository<StatsEntity>,
  private readonly authorRepo: AuthorRepository,
  private readonly fileRepo: FilesRepository,
  private readonly filesService: FilesService,
  
) { }

  async create(createMusicDto: CreateMusicDto) {

    const imageUrl = (await this.filesService.getFile(createMusicDto.imageId)).url
    const fileUrl = (await this.filesService.getFile(createMusicDto.fileIdForUrl)).url
    const newMusic = new MusicEntity
    const authorArr = []
    newMusic.name = createMusicDto.name
    newMusic.duration = createMusicDto.duration
    newMusic.imageUrl = imageUrl
    newMusic.file = await this.fileRepo.findOne(createMusicDto.fileIdForUrl)
    newMusic.fileUrl = fileUrl
    newMusic.albumId = createMusicDto.albumId
    newMusic.playCount = 0
    

    
  


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
    const music = await this.MusicRepository
      .createQueryBuilder('music')
      .where('music.id = :id', { id })
      .leftJoinAndSelect('music.album', 'album')
      .leftJoinAndSelect('music.authors', 'authors')
      .leftJoinAndSelect('music.file', 'files')
      .getOne()

    await this.increment(music)
      return music
      
  }

  async findManyByAlbum(albumId: number) {
    // Find all music where albumId matches
    return await this.MusicRepository
      .createQueryBuilder('music')
      .where('music.albumId = :albumId', { albumId })
      .leftJoinAndSelect('music.album', 'album')
      .leftJoinAndSelect('music.authors', 'authors')
      .leftJoinAndSelect('music.file', 'files')
      .getMany();  // Get many results instead of one

  }

  async findOneForStats(id: number) {

    return await this.MusicRepository
      .createQueryBuilder('music')
      .where('music.id = :id', { id })
      .leftJoinAndSelect('music.album', 'album')
      .leftJoinAndSelect('music.authors', 'authors')
      .leftJoinAndSelect('music.file', 'files')
      .getOne()
      
  }

  async update(id: number, updateMusicDto: UpdateMusicDto) {
    const musicToUpdate = await this.MusicRepository.findOneBy({ id });

    if (!musicToUpdate) {
      throw new Error('Music entity not found');
    }

    musicToUpdate.name = updateMusicDto.name || musicToUpdate.name;
    musicToUpdate.duration = updateMusicDto.duration || musicToUpdate.duration;
    musicToUpdate.fileUrl = musicToUpdate.fileUrl
    musicToUpdate.playCount = musicToUpdate.playCount

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

    if (updateMusicDto.imageId) {
      const imageUrl = (await this.filesService.getFile(updateMusicDto.imageId)).url;
      musicToUpdate.imageUrl = imageUrl;
    }

    return await this.MusicRepository.save(musicToUpdate);
  }


  async remove(id: number) {
    await this.MusicRepository
      .createQueryBuilder('music')
      .softDelete()
      .where('id = :id', { id })
      .execute();

    await this.statsEntity
    .createQueryBuilder('stats')
    .softDelete()
    .where('musicId = :id', {id})
    .execute()

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
      .leftJoinAndSelect('music.album', 'album')
      .leftJoinAndSelect('music.authors', 'authors')
      .getMany()
  }

  async increment(music: MusicEntity) {

    music.playCount ++

   await this.MusicRepository.save(music)
    
  }
}
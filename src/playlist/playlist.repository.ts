import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { MusicEntity } from 'src/music/entities/music.entity';
import { FilesService } from 'src/files/files.service';
import { UserRepository } from 'src/user/user.repository';
import { AlbumRepository } from 'src/album/album.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthorRepository } from 'src/author/author.repository';
import { AuthorEntity } from 'src/author/entities/author.entity';

@Injectable()
export class PlaylistRepository {

    constructor(@InjectRepository(PlaylistEntity)
                private readonly playlistRepository: Repository<PlaylistEntity>,
                @InjectRepository(MusicEntity)
                private readonly musicRepository: Repository<MusicEntity>,
                private readonly filesService: FilesService,
                private readonly authorRepo: AuthorRepository,

                @InjectRepository(UserEntity)
                private readonly userRepo: Repository<UserEntity>
        ) { }

    async create(data: CreatePlaylistDto) {
        const author = await this.authorRepo.findOne(data.authorId)
        const users = this.convertUsers(data.userId)
        const imageUrl = (await this.filesService.getFile(data.imageId)).url
        const newPlaylist = new PlaylistEntity;
        newPlaylist.title = data.title
        newPlaylist.description = data.description
        newPlaylist.imageUrl = imageUrl
        newPlaylist.authors = author
        newPlaylist.musics = this.convertMusics(data.musicIds)
        newPlaylist.user = users
        return await this.playlistRepository.save(newPlaylist);
    }

    async findAll() {
        return await this.playlistRepository
            .createQueryBuilder('playlist_entity')
            .leftJoinAndSelect('playlist_entity.musics', 'musics')
            .getMany()
    }

    async findOne(id: number) {
        return await this.playlistRepository
            .createQueryBuilder('playlist_entity')
            .where('playlist_entity.id = :id', { id })
            .leftJoinAndSelect('playlist_entity.musics', 'musics')
            .leftJoinAndSelect('musics.authors', 'authors')
            .leftJoin('playlist_entity.user', 'user')
            .addSelect('user.id')
            .getOne()
    }
    
    async update(id: number, data: UpdatePlaylistDto) {
        const playlist = await this.findOne(id);
        playlist.title = data.title || playlist.title
        playlist.description = data.description || playlist.description
        if (!playlist) {
            throw new NotFoundException(`Playlist with id ${id} not found`);
        }
    
        if (data.imageId) {
            const imageUrl = (await this.filesService.getFile(data.imageId)).url;
            playlist.imageUrl = imageUrl;
        }
    
        if (data.musicIds) {
            playlist.musics = this.convertMusics(data.musicIds);
        }
    
        if (data.userId) {
            const users = this.convertUsers(data.userId);
            playlist.user = users;
        }
    
        // Update other fields if necessary
        Object.assign(playlist, data);
    
        return await this.playlistRepository.save(playlist);
    }


    async remove(id: number) {
        await this.playlistRepository
            .createQueryBuilder('playlist_entity')
            .softDelete()
            .where('playlist_entity.id = :id', { id })
            .execute()

        return this.playlistRepository
            .createQueryBuilder('playlist_entity')
            .withDeleted()
            .where('playlist_entity.id = :id', { id })
            .getOne()
    }

    convertMusics(musicIds: number[]): MusicEntity[] {
        const musics = []
        for (let item of musicIds) {
            const music = new MusicEntity();
            music.id = item;
            musics.push(music)
        }
        return musics
    }
    convertUsers(userIds: number[]): UserEntity[] {
        const users = []
        for (let item of userIds) {
            const user = new UserEntity();
            user.id = item;
            users.push(user)
        }
        return users
    }

}

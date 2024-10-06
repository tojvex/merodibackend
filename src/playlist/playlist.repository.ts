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
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesRepository } from 'src/files/files.repository';

@Injectable()
export class PlaylistRepository {

    constructor(@InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
        @InjectRepository(MusicEntity)
        private readonly musicRepository: Repository<MusicEntity>,
        private readonly filesService: FilesService,
        private readonly filesRepository: FilesRepository,
        private readonly authorRepo: AuthorRepository,

        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ) { }

    async create(data: CreatePlaylistDto) {
        const file = await this.filesService.getFile(data.imageId);
        if (!file) {
            throw new NotFoundException(`File with id ${data.imageId} not found`);
        }
    
        const author = await this.authorRepo.findOne(data.authorId);
        if (!author) {
            throw new NotFoundException(`Author with id ${data.authorId} not found`);
        }

        const users = this.convertUsers(data.userId);
        if (!users.length) {
            throw new NotFoundException('No valid users found');
        }
    
        const newPlaylist = new PlaylistEntity();
        newPlaylist.title = data.title;
        newPlaylist.description = data.description;
        newPlaylist.imageUrl = file.url; 
        newPlaylist.authors = author;
        newPlaylist.musics = this.convertMusics(data.musicIds);
        newPlaylist.user = users;
        newPlaylist.file = file;  
    
        const savedPlaylist = await this.playlistRepository.save(newPlaylist);
    
        return {
            ...savedPlaylist,
            imageId: file.id,  
        };
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
        
        if (!playlist) {
            throw new NotFoundException(`Playlist with id ${id} not found`);
        }

        playlist.title = data.title || playlist.title;
        playlist.description = data.description || playlist.description;
    
        let file: FileEntity = playlist.file;
    
        if (data.imageId) {
            file = await this.filesService.getFile(data.imageId);  
            playlist.imageUrl = file.url; 
            playlist.file = file;  
        }
    
        if (data.musicIds) {
            playlist.musics = this.convertMusics(data.musicIds);
        }
    
        if (data.userId) {
            const users = this.convertUsers(data.userId);
            playlist.user = users;
        }
    
        Object.assign(playlist, data);
    
        const updatedPlaylist = await this.playlistRepository.save(playlist);
    
        return {
            ...updatedPlaylist,
            imageId: file.id, 
        };
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

    async search(query: string) {
        return this.playlistRepository
            .createQueryBuilder('playlist')
            .where('playlist.title LIKE :query', { query: `%${query}%` }) 
            .select([
                'playlist.id',
                'playlist.title',
                'playlist.description', 
            ])
            .getMany(); 
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

    async findAwsImageIds(): Promise<number[]> {
        return await this.filesRepository.findAwsFiles();
    }

}

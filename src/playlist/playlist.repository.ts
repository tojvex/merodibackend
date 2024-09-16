import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { MusicEntity } from 'src/music/entities/music.entity';

@Injectable()
export class PlaylistRepository {

    constructor(@InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(MusicEntity)
        private readonly musicRepository: Repository<MusicEntity>) { }

    async create(data: CreatePlaylistDto) {
        const newPlaylist = this.playlistRepository.create(data);
        newPlaylist.musics = this.convertMusics(data.musicIds)
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
            .getOne()
    }
    
    async update(id: number, data: UpdatePlaylistDto) {
        const { musicIds, ...columns } = data

        const playlist = new PlaylistEntity()
        playlist.id = id;
        Object.assign(playlist, columns)
        playlist.musics = this.convertMusics(musicIds)

        return await this.playlistRepository.save(playlist)
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
}

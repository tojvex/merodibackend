import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PlaylistRepository } from 'src/playlist/playlist.repository';
import { PlaylistEntity } from 'src/playlist/entities/playlist.entity';
import { CreatePlaylistDto } from 'src/playlist/dto/create-playlist.dto';


@Injectable()
export class UserRepository {
    constructor(@InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
        private readonly playlistRepo: PlaylistRepository) { }

    async create(createUserDto: CreateUserDto) {
        try {
            if (!createUserDto.playlist) {
                const newUser = new UserEntity
                newUser.email = createUserDto.email
                newUser.password = await this.hashPassword(createUserDto.password);

                const savedUser = await this.userRepository.save(newUser);

                const newPlaylist = await this.createDefaultPlaylist(savedUser.id);

                savedUser.playlist = [newPlaylist];
                const updatedUser = await this.userRepository.save(savedUser);

                const { password, ...userWithoutPassword } = updatedUser;
                return userWithoutPassword;
            }
        } catch (error) {

            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Email is already in use');
            }
            throw new Error('Registration failed');
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    private async createDefaultPlaylist(userId: number) {
        const playlistDto = {
            title: 'FavSongs',
            description: 'Empty Description',
            userId: [userId],
            musicIds: [],
            imageId: 197
        };

        return await this.playlistRepo.create(playlistDto);
    }


    async findAll() {
        return await this.userRepository
            .createQueryBuilder('user_entity')
            .select(['user_entity.id', 'user_entity.email', 'user_entity.createdAt',
                'user_entity.updatedAt'])
            .getMany()
    }

    async findOne(id: number) {
        return await this.userRepository
            .createQueryBuilder('user_entity')
            .where('user_entity.id = :id', { id })
            .select([
                'user_entity.id',
                'user_entity.email',
                'user_entity.createdAt',
                'user_entity.updatedAt'
            ])
            .leftJoinAndSelect('user_entity.playlist', 'playlist')
            .leftJoinAndSelect('playlist.musics', 'musics')
            .getOne()
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        console.log(updateUserDto)
        const userToUpdate = await this.userRepository.findOneBy({ id })
        const playlists = []
        if (updateUserDto.playlist) {
            for (let i = 0; i < updateUserDto.playlist.length; i++) {
                const playlist = await this.playlistRepo.findOne(updateUserDto.playlist[i])
                playlists.push(playlist)
            }
        }

        console.log(playlists)

        if (updateUserDto.password) {
            const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
            updateUserDto.password = hashedPassword;
        }

        userToUpdate.email = updateUserDto.email || userToUpdate.email
        userToUpdate.password = updateUserDto.password || userToUpdate.password
        if(playlists.length > 0){
            userToUpdate.playlist = playlists
        }
        
        

        await this.userRepository.save(userToUpdate)

        return this.findOne(userToUpdate.id)
    }

    async remove(id: number) {
        await this.userRepository.softDelete(id)

        return this.userRepository
            .createQueryBuilder('user_entity')
            .withDeleted()
            .where('user_entity.id = :id', { id })
            .select(['user_entity.id', 'user_entity.email'])
            .getOne()
    }

    async findOneByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email: email } })

        return user

    }

    async search(query: string) {
        return this.userRepository
            .createQueryBuilder('user')
            .where('user.email LIKE :query', { query: `%${query}%` })
            .select([
                'user.id',
                'user.email',
            ])
            .getMany()
    }
}
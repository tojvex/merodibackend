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
        const newUser = this.userRepository.create(createUserDto);
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        newUser.password = hashedPassword;

        try {
            // Save the user first
            const savedUser = await this.userRepository.save(newUser);

            // Create a new empty playlist for the user using the existing create() method
            const playlistDto: CreatePlaylistDto = {
                title: 'FavSongs',
                description: 'Empty Description',
                userId: savedUser.id, // Set the user ID
                musicIds: [] // Empty music list
                ,
                image: ''
            };

            const newPlaylist = await this.playlistRepo.create(playlistDto); // Use the repository's create method

            // Link the new playlist to the user
            savedUser.playlist = [newPlaylist];

            // Save the user with the playlist linked
            const result = await this.userRepository.save(savedUser);

            const { password, ...UserEntity } = result;
            return UserEntity;
        } catch (err) {
            if (err.errno === 1062) {
                return 'Email is already in use';
            }
            throw new Error('Registration failed');
        }
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

        if (updateUserDto.password) {
            const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
            updateUserDto.password = hashedPassword;
        }

        await this.userRepository
            .createQueryBuilder('user_entity')
            .update()
            .set(updateUserDto)
            .where('user_entity.id = :id', { id })
            .execute()

        return await this.userRepository.findOneBy({ id })
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
}
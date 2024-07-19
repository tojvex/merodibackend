import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {

    constructor(@InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) { }

    async create(createUserDto: CreateUserDto) {
        const newUser = this.userRepository.create(createUserDto)

        return await this.userRepository.save(newUser)
    }

    async findAll() {
        return await this.userRepository
            .createQueryBuilder('user')
            .getMany()
    }

    async findOne(id: number) {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne()
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.userRepository
            .createQueryBuilder('user')
            .update()
            .set(updateUserDto)
            .where('user.id = :id', { id })
    }

    async remove(id: number) {
        await this.userRepository.softDelete(id)

        return this.userRepository
            .createQueryBuilder('user')
            .withDeleted()
            .where('user.id = :id', { id })
            .execute()
    }
}
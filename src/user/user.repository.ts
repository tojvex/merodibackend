import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserRepository {
    constructor(@InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) { }

    async create(createUserDto: CreateUserDto) {
        const newUser = this.userRepository.create(createUserDto)
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        newUser.password = hashedPassword;

        
        return await this.userRepository.save(newUser)


        const {password, ...rest} = newUser
         await this.userRepository.save(newUser)
         return rest

    }

    async findAll() {
        return await this.userRepository
            .createQueryBuilder('user_entity')
            .getMany()
    }

    async findOne(id: number) {
        return await this.userRepository
            .createQueryBuilder('user_entity')
            .where('user_entity.id = :id', { id })
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

        return await this.userRepository.findOneBy({id})
    }

    async remove(id: number) {
        await this.userRepository.softDelete(id)

        return this.userRepository
            .createQueryBuilder('user_entity')
            .withDeleted()
            .where('user_entity.id = :id', { id })
            .getOne()
    }

    async findOneByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email: email}})

        return user

    }
}
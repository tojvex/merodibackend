import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorEntity } from "./entities/author.entity";
import { Repository } from "typeorm";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";

@Injectable()
export class AuthorRepository {
    constructor(@InjectRepository(AuthorEntity)
    private AuthorRepository: Repository<AuthorEntity>) { }

    async create(createAuthorDto: CreateAuthorDto) {

        const author = await this.AuthorRepository
            .createQueryBuilder()
            .insert()
            .values(createAuthorDto)
            .execute()

        return author.generatedMaps[0]
    }

    async findAll() {
        return await this.AuthorRepository
            .createQueryBuilder('author')
            .leftJoinAndSelect('author.musics', 'music')
            .leftJoinAndSelect('author.albums', 'albums')
            .getMany()
    }

    async findOne(id: number) {
        return await this.AuthorRepository
            .createQueryBuilder('author')
            .where('author.id = :id', { id })
            .getOne()

    }

    async update(id: number, updateAuthorDto: UpdateAuthorDto) {
        await this.AuthorRepository
            .createQueryBuilder()
            .update()
            .set(updateAuthorDto)
            .where('id = :id', { id })
            .execute()

        return await this.AuthorRepository
            .createQueryBuilder()
            .where('id = :id', { id })
            .getOne()

    }

    async remove(id: number) {
        await this.AuthorRepository
            .createQueryBuilder()
            .softDelete()
            .from(AuthorEntity)
            .where('id', { id })
            .execute()

        return await this.AuthorRepository
            .createQueryBuilder()
            .withDeleted()
            .where('id', { id })
            .getOne()

    }
}
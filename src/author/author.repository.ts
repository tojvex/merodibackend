import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Author } from "./entities/author.entity";
import { Repository } from "typeorm";
import { CreateAuthorDto } from "./dtos/create-author.dto";
import { UpdateAuthorDto } from "./dtos/update-author.dto";

@Injectable()
export class AuthorRepository {
    constructor (@InjectRepository(Author)
                    private authorRepository: Repository<Author>) {}

   async create(createAuthorDto :  CreateAuthorDto){
        const author = await this.authorRepository
        .createQueryBuilder()
        .insert()
        .into(Author)
        .values(createAuthorDto)
        .execute()

        return author.generatedMaps[0]

    }

    findAll() {

        return  this.authorRepository
        .createQueryBuilder()
        .getMany()

    }

    findOne(id:number) {

        return this.authorRepository
        .createQueryBuilder('author')
        .where('author.id = :id', {id})
        .getOne()


    } 

  async  update(id:number, updateAuthorDto: UpdateAuthorDto){

    await this.authorRepository
    .createQueryBuilder('author')
    .where('author.id = :id', {id})
    .update()
    .set(updateAuthorDto)
    .execute()

    return this.authorRepository.findOneBy({id})

    }

   async  remove(id:number){

    await this.authorRepository
    .createQueryBuilder('author')
    .softDelete()
    .from(Author)
    .where('author.id = :id', {id})
    .execute()

    return this.authorRepository
    .createQueryBuilder('author')
    .withDeleted()
    .where('author.id = :id', {id})
    .getOne()
    }
}
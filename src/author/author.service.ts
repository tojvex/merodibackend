import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';
import { AuthorRepository } from './author.repository';

@Injectable()
export class AuthorService {
    constructor(private readonly authorRepository: AuthorRepository) {}

    create(createAuthorDto: CreateAuthorDto){
        return  this.authorRepository.create(createAuthorDto)
    }

    findAll() {
        return  this.authorRepository.findAll()
    }

    findOne(id: number){
        return this.authorRepository.findOne(id)

    }

    update(id:number, updateAuthorDto: UpdateAuthorDto){
        return this.authorRepository.update(id, updateAuthorDto)

    }

    remove(id:number) {
        return this.authorRepository.remove(id)

    }
}

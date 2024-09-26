import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesRepository {

    constructor(@InjectRepository(FileEntity)
    private readonly filesRepository: Repository<FileEntity>) { }

    async save(name: string, url: string, key: string, bucket: string) {
        
        const newFile = new FileEntity()

        newFile.fileName = name
        newFile.url = url
        newFile.key = key
        newFile.bucket = bucket

        return await this.filesRepository.save(newFile)
    }

    async findOne(id: number) {
        return await this.filesRepository.findOne({
          where: { id },
        });
      }      
}

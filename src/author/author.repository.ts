import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorEntity } from "./entities/author.entity";
import { Repository } from "typeorm";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";
import { AlbumRepository } from "src/album/album.repository";
import { MusicRepository } from "src/music/music.repository";
import { FilesService } from "src/files/files.service";

@Injectable()
export class AuthorRepository {
    constructor(@InjectRepository(AuthorEntity)
    private AuthorRepository: Repository<AuthorEntity>,
        private readonly albumRepo: AlbumRepository,
        @Inject(forwardRef(() => MusicRepository))
        private readonly musicRepo: MusicRepository,
        private readonly filesService: FilesService) { }

    async create(createAuthorDto: CreateAuthorDto) {
        let file = null;
        let imageUrl = null;

        if (createAuthorDto.imageId) {
            file = await this.filesService.getFile(createAuthorDto.imageId);
            if (!file) {
                throw new NotFoundException('Image file not found');
            }
            imageUrl = file.url;
        } else {
            throw new BadRequestException('Image is required');
        }

        imageUrl = (await this.filesService.getFile(createAuthorDto.imageId)).url
        const author = new AuthorEntity
        author.firstName = createAuthorDto.firstName
        author.lastName = createAuthorDto.lastName
        author.biography = createAuthorDto.biography
        author.imageUrl = imageUrl
        author.file = file

        const albums = []
        const musics = []
        if (createAuthorDto.albums && createAuthorDto.albums.length > 0) {
            for (let i = 0; i < createAuthorDto.albums.length; i++) {
                const album = await this.albumRepo.findOne(+createAuthorDto.albums[i])
                albums.push(album)
            }
        }

        if (createAuthorDto.musics && createAuthorDto.musics.length > 0) {
            for (let i = 0; i < createAuthorDto.musics.length; i++) {

                const music = await this.musicRepo.findOne(+createAuthorDto.musics[i])
                musics.push(music)
            }
        }

        author.albums = albums
        author.musics = musics

        return await this.AuthorRepository.save(author)
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
            .leftJoinAndSelect('author.musics', 'music')
            .leftJoinAndSelect('author.albums', 'albums')
            .getOne()

    }

    async findOneByFirstNameOrLastName(firstName: string, lastName: string) {
        return await this.AuthorRepository
            .createQueryBuilder('author')
            .where('author.firstName = :firstName AND author.lastName = :lastName', { firstName, lastName })
            .leftJoinAndSelect('author.musics', 'music')
            .leftJoinAndSelect('author.albums', 'albums')
            .getOne();
    }

    async update(id: number, updateAuthorDto: UpdateAuthorDto) {
        const author = await this.AuthorRepository.findOne({ where: { id } });
        if (!author) {
            throw new NotFoundException(`Author with ID ${id} not found`);
        }
        console.log(updateAuthorDto.imageId)

        if (updateAuthorDto.imageId) {
            const imageUrl = (await this.filesService.getFile(updateAuthorDto.imageId)).url
            author.imageUrl = imageUrl
        }
        else {
            author.imageUrl = author.imageUrl
        }
        console.log(author.imageUrl)
        author.firstName = updateAuthorDto.firstName || author.firstName;
        author.lastName = updateAuthorDto.lastName || author.lastName;
        author.biography = updateAuthorDto.biography || author.biography


        if (updateAuthorDto.albums) {
            const albums = [];
            for (let i = 0; i < updateAuthorDto.albums.length; i++) {
                const album = await this.albumRepo.findOne(+updateAuthorDto.albums[i]);
                if (album) {
                    albums.push(album);
                }
            }

            author.albums = albums;
        } else {
            author.albums = author.albums
        }


        if (updateAuthorDto.musics) {
            const musics = [];
            for (let i = 0; i < updateAuthorDto.musics.length; i++) {
                const music = await this.musicRepo.findOne(+updateAuthorDto.musics[i]);
                if (music) {
                    musics.push(music);
                }
            }
            author.musics = musics;
        } else {
            author.musics = author.musics
        }


        return await this.AuthorRepository.save(author);
    }


    async remove(id: number) {
        await this.AuthorRepository
            .createQueryBuilder()
            .softDelete()
            .from(AuthorEntity)
            .where('id = :id', { id })
            .execute()

        return await this.AuthorRepository
            .createQueryBuilder()
            .withDeleted()
            .where('id = :id', { id })
            .getOne()

    }

    async search(query: string) {
        return this.AuthorRepository
            .createQueryBuilder('author')
            .where('author.firstName LIKE :query', { query: `%${query}%` })
            .orWhere('author.lastName LIKE :query', { query: `%${query}%` })
            .leftJoinAndSelect('author.musics', 'music')
            .leftJoinAndSelect('author.albums', 'albums')
            .getMany()
    }
}
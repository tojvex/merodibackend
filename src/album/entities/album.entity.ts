import { AuthorEntity } from "src/author/entities/author.entity";
import { MusicEntity } from "src/music/entities/music.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AlbumEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    releaseDate: string

    @OneToMany(() => MusicEntity, (musics) => musics.album)
    musics: MusicEntity[]

    @ManyToMany(() => AuthorEntity, (authors) => authors.albums)
    authors: AuthorEntity[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: string
}

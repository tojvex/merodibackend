import { AuthorEntity } from "src/author/entities/author.entity";
import { FileEntity } from "src/files/entities/file.entity";
import { MusicEntity } from "src/music/entities/music.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AlbumEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    releaseDate: string

    @Column({nullable: true})
    description: string

    @Column({nullable: true})
    imageUrl: string

    @OneToMany(() => MusicEntity, (musics) => musics.album)
    musics: MusicEntity[]

    @ManyToMany(() => AuthorEntity, (authors) => authors.albums)
    authors: AuthorEntity[]

    @ManyToOne(() => FileEntity, (file) => file.albums)
    file: FileEntity;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: string
}

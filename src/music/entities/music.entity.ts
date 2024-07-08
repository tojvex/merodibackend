import { AlbumEntity } from "src/album/entities/album.entity";
import { AuthorEntity } from "src/author/entities/author.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MusicEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    name: string;


    @Column()
    duration: number;

    @Column({nullable: true})
    authorId: number;

    @Column({nullable: true})
    albumId: number

    @ManyToOne(() => AlbumEntity, (album) => album.musics)
    album: AlbumEntity

    @ManyToMany( () => AuthorEntity, (authors) => authors.musics)
    authors: AuthorEntity[]


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;



    
}

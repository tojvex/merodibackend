import { AlbumEntity } from "src/album/entities/album.entity";
import { MusicEntity } from "src/music/entities/music.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AuthorEntity {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({type: 'longtext'})
    biography: string

    @ManyToMany(() => MusicEntity, (musics) => musics.authors)
    @JoinTable()
    musics: MusicEntity[]

    @ManyToMany(() => AlbumEntity, (albums) => albums.authors)
    @JoinTable()
    albums: AlbumEntity[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}

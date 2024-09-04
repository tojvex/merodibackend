import { AlbumEntity } from "src/album/entities/album.entity";
import { AuthorEntity } from "src/author/entities/author.entity";
import { PlaylistEntity } from "src/playlist/entities/playlist.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MusicEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: true})
    name: string;

    @Column({nullable: true})
    duration: number;

    @Column({nullable: true})
    albumId: number

    @ManyToOne(() => AlbumEntity, (album) => album.musics)
    album: AlbumEntity

    @ManyToMany( () => AuthorEntity, (authors) => authors.musics)
    authors: AuthorEntity[]

    @ManyToMany(() => PlaylistEntity, (playlist) => playlist.musics )
    @JoinTable({name: "music_playlist"})
    playlist: PlaylistEntity[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

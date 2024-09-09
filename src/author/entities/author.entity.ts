import { AlbumEntity } from "src/album/entities/album.entity";
import { MusicEntity } from "src/music/entities/music.entity";
import { PlaylistEntity } from "src/playlist/entities/playlist.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AuthorEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ type: 'longtext' })
    biography: string

  
    @OneToMany(() => MusicEntity, (musics) => musics.authors)
    musics: MusicEntity
  
    @Column({ nullable: true})
    imageUrl: string

    @ManyToMany(() => MusicEntity, (musics) => musics.authors)
    @JoinTable()
    musics: MusicEntity[]
  

    @ManyToMany(() => AlbumEntity, (albums) => albums.authors)
    @JoinTable({name: "album_author"})
    albums: AlbumEntity[]

    @OneToMany(() => PlaylistEntity, (playlist) => playlist.author)
    playlist: PlaylistEntity[];

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}

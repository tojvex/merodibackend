import { AlbumEntity } from "src/album/entities/album.entity";
import { AuthorEntity } from "src/author/entities/author.entity";
import { FileEntity } from "src/files/entities/file.entity";
import { PlaylistEntity } from "src/playlist/entities/playlist.entity";
import { StatsEntity } from "src/stats/entities/stat.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MusicEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: true})
    name: string;

    @Column({nullable: true})
    duration: number;
    
    @Column('text')
    imageUrl: string;

    @Column('text')
    fileUrl: string

    @Column({nullable: true})
    albumId: number;

    @Column()
    playCount:number



    @ManyToOne(() => AlbumEntity, (album) => album.musics)
    album: AlbumEntity;

    @ManyToMany(() => AuthorEntity, (authors) => authors.musics)
    authors: AuthorEntity[];

    @ManyToOne(() => FileEntity, (file) => file.musics)
    file: FileEntity;

    @ManyToMany(() => PlaylistEntity, (playlist) => playlist.musics )
    @JoinTable({name: "music_playlist"})
    playlist: PlaylistEntity[];

   
    @OneToMany(() => StatsEntity, stats => stats.music)
    stats: StatsEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

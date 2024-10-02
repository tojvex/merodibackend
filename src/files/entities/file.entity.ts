import { AlbumEntity } from "src/album/entities/album.entity";
import { AuthorEntity } from "src/author/entities/author.entity";
import { MusicEntity } from "src/music/entities/music.entity";
import { PlaylistEntity } from "src/playlist/entities/playlist.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @Column()
    key: string;

    @Column()
    bucket: string;
    
    @Column()
    fileName: string;

    @OneToMany(() => MusicEntity, (musics) => musics.file)
    musics: MusicEntity[];

    @OneToMany(() => AlbumEntity, (albums) => albums.file)
    albums: AlbumEntity[];

    @OneToMany(() => AuthorEntity, (authors) => authors.file)
    authors: AuthorEntity[];

    @OneToMany(() => PlaylistEntity, (playlists) => playlists.file)
    playlists: PlaylistEntity[];

    @OneToMany(() => UserEntity, (user) => user.file)
    user: UserEntity[];

}

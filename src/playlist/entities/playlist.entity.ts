import { AuthorEntity } from "src/author/entities/author.entity";
import { MusicEntity } from "src/music/entities/music.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PlaylistEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 255 , nullable: true})
    description: string;

    @Column()
    image: string;

    @ManyToOne(() => AuthorEntity, author => author.playlist)
    author: AuthorEntity;

    @ManyToMany(() => UserEntity, user => user.playlist)
    user: UserEntity[];

    @ManyToMany(() => MusicEntity, music => music.playlist , {cascade: true})
    musics: MusicEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

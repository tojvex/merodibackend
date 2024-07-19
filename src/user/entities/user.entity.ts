import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AuthorEntity } from "src/author/entities/author.entity";
import { MusicEntity } from "src/music/entities/music.entity";
import { AlbumEntity } from "src/album/entities/album.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    @OneToMany(() => AuthorEntity, (author) => author.user)
    authors: AuthorEntity[];

    @OneToMany(() => MusicEntity, (music) => music.user)
    musics: MusicEntity[];

    @OneToMany(() => AlbumEntity, (album) => album.user)
    albums: AlbumEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AuthorEntity } from "src/author/entities/author.entity";
import { MusicEntity } from "src/music/entities/music.entity";
import { AlbumEntity } from "src/album/entities/album.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    name: string;

    @Column({length: 255})
    email: string;

    @Column({length: 255 })
    password: string;

    // @BeforeInsert()
    // @BeforeUpdate()
    // async hashPassword() {
    //     if (this.password) {
    //         this.password = await bcrypt.hash(this.password, 10);
    //     }
    // }

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

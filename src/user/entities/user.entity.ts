import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlaylistEntity } from "src/playlist/entities/playlist.entity";

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

    @OneToMany(() => PlaylistEntity, (playlist) => playlist.user)
    playlist: PlaylistEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

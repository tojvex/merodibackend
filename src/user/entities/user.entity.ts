import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlaylistEntity } from "src/playlist/entities/playlist.entity";
import { RoleEnum } from "src/auth/enums/roles.enums";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255, unique: true})
    email: string;

    @Column({length: 255 })
    password: string;

    @Column({length: 255, unique: true, nullable: true})
    name: string

    @Column({default: RoleEnum.user, type: 'enum', enum: RoleEnum})
    role: RoleEnum;

    @ManyToMany(() => PlaylistEntity, (playlist) => playlist.user)
    @JoinTable()
    playlist: PlaylistEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

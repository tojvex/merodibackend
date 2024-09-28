import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlaylistEntity } from "src/playlist/entities/playlist.entity";
import { RoleEnum } from "src/auth/enums/roles.enums";
import { FileEntity } from "src/files/entities/file.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255, unique: true})
    email: string;

    @Column({length: 255 })
    password: string;

    @Column({default: RoleEnum.user, type: 'enum', enum: RoleEnum})
    role: RoleEnum;

    @ManyToOne(() => FileEntity, (file) => file.user)
    file: FileEntity;

    @ManyToMany(() => PlaylistEntity, (playlist) => playlist.user, { cascade: true })
    @JoinTable()
    playlist: PlaylistEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

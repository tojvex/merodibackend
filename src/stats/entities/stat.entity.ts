import { MusicEntity } from "src/music/entities/music.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('stats')
export class StatsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, user => user.stats)
  user: UserEntity;

  @ManyToOne(() => MusicEntity, music => music.stats)
  music: MusicEntity;

  @Column({ default: 0 })
  playCount: number;

  @CreateDateColumn()
  date: Date;  // Automatically records the timestamp of the entry
}
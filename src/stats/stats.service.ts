import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StatsEntity } from './entities/stat.entity';
import { MusicRepository } from '../music/music.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(StatsEntity)
    private statsRepository: Repository<StatsEntity>,
    private musicRepository: MusicRepository,
    private userRepository: UserRepository
  ) { }

  async recordPlay(userId: number, musicId: number){
    const user = await this.userRepository.findOne(userId);
    const music = await this.musicRepository.findOne(musicId);

    if (!user || !music) {
        throw new NotFoundException('User or music not found');
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); 


    let stat = await this.statsRepository.findOne({
        where: {
            user: { id: user.id },
            music: { id: music.id },  
            date: today,             
        },
    });

    if (!stat) {
        stat = new StatsEntity();
        stat.date = today;
        stat.user = user;
        stat.music = music;
        stat.playCount = 1;
    } else {
        stat.playCount += 1;
    }

    await this.statsRepository.save(stat);
}

async countTotalListens(musicId: number){
  const result = await this.statsRepository.createQueryBuilder('stats')
      .select('SUM(stats.playCount)', 'totalListens')
      .where('stats.musicId = :musicId', { musicId })
      .getRawOne();

  return result.totalListens ? +result.totalListens : 0;
}

async getMostPlayedMusics(limit: number){
  const results = await this.statsRepository.createQueryBuilder('stats')
      .select('stats.musicId, SUM(stats.playCount) AS totalPlays')
      .groupBy('stats.musicId')
      .orderBy('totalPlays', 'DESC')
      .limit(limit)
      .getRawMany();


      return results

}

async getMostPlayedMusicsToday(limit: number){
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const results = await this.statsRepository.createQueryBuilder('stats')
      .select('stats.musicId, SUM(stats.playCount) AS totalPlays')
      .where('stats.date = :today', { today })
      .groupBy('stats.musicId')
      .orderBy('totalPlays', 'DESC')
      .limit(limit)
      .getRawMany();

    return results
}

async getMostPlayedMusicsLastWeek(limit: number){
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const results = await this.statsRepository.createQueryBuilder('stats')
      .select('stats.musicId, SUM(stats.playCount) AS totalPlays')
      .where('stats.date >= :sevenDaysAgo', { sevenDaysAgo })
      .groupBy('stats.musicId')
      .orderBy('totalPlays', 'DESC')
      .limit(limit)
      .getRawMany();

     
     return results
}


}
import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post('/:userId/:musicId')
  async recordPlay(
    @Param('userId') userId: number,
    @Param('musicId') musicId: number,
  ): Promise<void> {
   return  await this.statsService.recordPlay(userId, musicId);
  }

  @Get('/:musicId')
  async countTotalListens(@Param('musicId') musicId: number) {
    return await this.statsService.countTotalListens(musicId)

  }

  @Get('/top/:limit')
  async getMostlyPlayedMusics(@Param('limit') limit: number ){
   return await this.statsService.getMostPlayedMusics(limit)
  }

  @Get('/topOfDay/:limit')
  async getMostlyPlayedMusicsOfDay(@Param('limit') limit: number) {
    return this.statsService.getMostPlayedMusicsToday(limit)
  }

  @Get('/topOfWeek/:limit')
  async getMostlyPlayedMusicsOfWeek(@Param('limit') limit: number) {
    return this.statsService.getMostPlayedMusicsLastWeek(limit)
  }
}



import { forwardRef, Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MusicModule } from 'src/music/music.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsEntity } from './entities/stat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StatsEntity]),
    forwardRef(() => MusicModule),
    forwardRef(() => UserModule),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService]
})
export class StatsModule {}

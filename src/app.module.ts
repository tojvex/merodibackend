import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicModule } from './music/music.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Tornike123',
      database: 'merodi',
      autoLoadEntities: true,
      synchronize: true,

    }),
    MusicModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
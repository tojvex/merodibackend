import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicModule } from './music/music.module';
import { AlbumModule } from './album/album.module';
import { AuthorModule } from './author/author.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'Music',
      autoLoadEntities: true,
      synchronize: true,

    }),
    MusicModule,
    AlbumModule,
    AuthorModule,
    SearchModule,
    UserModule,
    UserModule,
    AuthModule,
    PlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

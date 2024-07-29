import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicModule } from './music/music.module';
import { AlbumModule } from './album/album.module';
import { AuthorModule } from './author/author.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'Tornike123',
      database: 'merodi',
      autoLoadEntities: true,
      synchronize: true,

    }),
    MusicModule,
    AlbumModule,
    AuthorModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

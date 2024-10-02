import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FilesRepository } from './files.repository';
import { AwsModule } from 'src/aws/aws.module';
import { MusicModule } from 'src/music/music.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), 
  AwsModule,
  forwardRef(() => MusicModule)],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository],
  exports: [FilesRepository, FilesService]
})
export class FilesModule {}

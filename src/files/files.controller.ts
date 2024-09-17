import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { url } from 'inspector';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file)
  }

  @Get(':id')
  @Public()
  getFile(@Param('id') id: number) {
    return this.filesService.getFile(id);
  }
}
